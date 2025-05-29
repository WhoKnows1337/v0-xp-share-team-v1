import { getAllEmbeddings, storeClusters } from "./vector-database"
import { cosineSimilarity } from "./embedding-service"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { aiCache } from "./ai-cache"

export interface Cluster {
  id: number
  name: string
  description: string
  centroid: number[]
  experiences: Array<{
    id: string
    title: string
    similarity: number
  }>
}

/**
 * K-Means Clustering für Erlebnisse
 */
export class ClusteringService {
  /**
   * Führt K-Means Clustering durch
   */
  async performKMeansClustering(k = 5, maxIterations = 100): Promise<Cluster[]> {
    const cacheKey = `clustering:kmeans:k${k}`
    const cached = await aiCache.get<Cluster[]>(cacheKey)
    if (cached) {
      console.log("📦 Clustering aus Cache geladen")
      return cached
    }

    console.log("🔄 Führe K-Means Clustering durch...")

    // Hole alle Embeddings
    const embeddings = await getAllEmbeddings()

    if (embeddings.length < k) {
      throw new Error(`Nicht genügend Daten für ${k} Cluster (${embeddings.length} Embeddings verfügbar)`)
    }

    // Initialisiere Zentroide zufällig
    const centroids = this.initializeCentroids(embeddings, k)
    const assignments = new Array(embeddings.length).fill(0)
    let hasChanged = true
    let iteration = 0

    while (hasChanged && iteration < maxIterations) {
      hasChanged = false
      iteration++

      // Weise jeden Punkt dem nächsten Zentroid zu
      for (let i = 0; i < embeddings.length; i++) {
        let bestCluster = 0
        let bestSimilarity = -1

        for (let j = 0; j < k; j++) {
          const similarity = cosineSimilarity(embeddings[i].embedding, centroids[j])
          if (similarity > bestSimilarity) {
            bestSimilarity = similarity
            bestCluster = j
          }
        }

        if (assignments[i] !== bestCluster) {
          assignments[i] = bestCluster
          hasChanged = true
        }
      }

      // Aktualisiere Zentroide
      for (let j = 0; j < k; j++) {
        const clusterPoints = embeddings.filter((_, i) => assignments[i] === j)
        if (clusterPoints.length > 0) {
          centroids[j] = this.calculateCentroid(clusterPoints.map((p) => p.embedding))
        }
      }

      console.log(`Iteration ${iteration}: ${hasChanged ? "Änderungen" : "Konvergiert"}`)
    }

    // Erstelle Cluster-Objekte
    const clusters: Cluster[] = []
    for (let j = 0; j < k; j++) {
      const clusterExperiences = embeddings
        .map((emb, i) => ({ ...emb, index: i }))
        .filter((_, i) => assignments[i] === j)
        .map((exp) => ({
          id: exp.experience_id,
          title: exp.text_content.substring(0, 100), // Erste 100 Zeichen als Titel
          similarity: cosineSimilarity(exp.embedding, centroids[j]),
        }))
        .sort((a, b) => b.similarity - a.similarity)

      if (clusterExperiences.length > 0) {
        // Generiere Namen und Beschreibungen mit AI
        const { name, description } = await this.generateClusterMetadata(clusterExperiences)

        clusters.push({
          id: j,
          name,
          description,
          centroid: centroids[j],
          experiences: clusterExperiences,
        })
      }
    }

    // Cache das Ergebnis
    await aiCache.set(cacheKey, clusters, 240) // 4 Stunden Cache

    console.log(`✅ ${clusters.length} Cluster erstellt`)
    return clusters
  }

  /**
   * Hierarchisches Clustering
   */
  async performHierarchicalClustering(threshold = 0.7): Promise<Cluster[]> {
    const cacheKey = `clustering:hierarchical:t${threshold}`
    const cached = await aiCache.get<Cluster[]>(cacheKey)
    if (cached) {
      return cached
    }

    console.log("🔄 Führe hierarchisches Clustering durch...")

    const embeddings = await getAllEmbeddings()
    const clusters: Array<{
      experiences: typeof embeddings
      centroid: number[]
    }> = embeddings.map((emb) => ({
      experiences: [emb],
      centroid: emb.embedding,
    }))

    // Merge ähnliche Cluster
    while (true) {
      let bestMerge = { i: -1, j: -1, similarity: -1 }

      // Finde die ähnlichsten Cluster
      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const similarity = cosineSimilarity(clusters[i].centroid, clusters[j].centroid)
          if (similarity > bestMerge.similarity) {
            bestMerge = { i, j, similarity }
          }
        }
      }

      // Stoppe wenn keine ähnlichen Cluster mehr gefunden werden
      if (bestMerge.similarity < threshold) {
        break
      }

      // Merge die beiden ähnlichsten Cluster
      const cluster1 = clusters[bestMerge.i]
      const cluster2 = clusters[bestMerge.j]

      const mergedExperiences = [...cluster1.experiences, ...cluster2.experiences]
      const mergedCentroid = this.calculateCentroid(mergedExperiences.map((e) => e.embedding))

      clusters[bestMerge.i] = {
        experiences: mergedExperiences,
        centroid: mergedCentroid,
      }

      clusters.splice(bestMerge.j, 1)

      console.log(`Cluster gemerged. Verbleibende Cluster: ${clusters.length}`)
    }

    // Konvertiere zu Cluster-Format
    const result: Cluster[] = []
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i]
      const experiences = cluster.experiences.map((exp) => ({
        id: exp.experience_id,
        title: exp.text_content.substring(0, 100),
        similarity: cosineSimilarity(exp.embedding, cluster.centroid),
      }))

      const { name, description } = await this.generateClusterMetadata(experiences)

      result.push({
        id: i,
        name,
        description,
        centroid: cluster.centroid,
        experiences,
      })
    }

    await aiCache.set(cacheKey, result, 240)
    return result
  }

  /**
   * Initialisiert Zentroide zufällig
   */
  private initializeCentroids(embeddings: any[], k: number): number[][] {
    const centroids: number[][] = []
    const used = new Set<number>()

    for (let i = 0; i < k; i++) {
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * embeddings.length)
      } while (used.has(randomIndex))

      used.add(randomIndex)
      centroids.push([...embeddings[randomIndex].embedding])
    }

    return centroids
  }

  /**
   * Berechnet den Zentroid (Durchschnitt) von Vektoren
   */
  private calculateCentroid(vectors: number[][]): number[] {
    if (vectors.length === 0) return []

    const dimensions = vectors[0].length
    const centroid = new Array(dimensions).fill(0)

    for (const vector of vectors) {
      for (let i = 0; i < dimensions; i++) {
        centroid[i] += vector[i]
      }
    }

    for (let i = 0; i < dimensions; i++) {
      centroid[i] /= vectors.length
    }

    return centroid
  }

  /**
   * Generiert Namen und Beschreibung für einen Cluster mit AI
   */
  private async generateClusterMetadata(experiences: Array<{ title: string }>): Promise<{
    name: string
    description: string
  }> {
    const sampleTitles = experiences.slice(0, 5).map((e) => e.title)

    const prompt = `
      Analysiere die folgenden Erlebnis-Titel und erstelle einen passenden Cluster-Namen und eine Beschreibung:

      Titel:
      ${sampleTitles.join("\n")}

      Erstelle:
      1. Einen prägnanten Cluster-Namen (max. 30 Zeichen)
      2. Eine kurze Beschreibung (max. 100 Zeichen)

      Antworte im JSON-Format:
      {
        "name": "Cluster-Name",
        "description": "Beschreibung des Clusters"
      }
    `

    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt,
        temperature: 0.7,
      })

      const result = JSON.parse(text)
      return {
        name: result.name || `Cluster ${Math.random().toString(36).substr(2, 5)}`,
        description: result.description || "Automatisch generierter Cluster",
      }
    } catch (error) {
      console.error("Fehler beim Generieren der Cluster-Metadaten:", error)
      return {
        name: `Cluster ${Math.random().toString(36).substr(2, 5)}`,
        description: "Automatisch generierter Cluster",
      }
    }
  }

  /**
   * Speichert Clustering-Ergebnisse in der Datenbank
   */
  async saveClusters(clusters: Cluster[]) {
    const clusterData = clusters.map((cluster) => ({
      name: cluster.name,
      description: cluster.description,
      centroid: cluster.centroid,
      experienceIds: cluster.experiences.map((e) => e.id),
    }))

    await storeClusters(clusterData)
    console.log("✅ Cluster in Datenbank gespeichert")
  }
}

export const clusteringService = new ClusteringService()
