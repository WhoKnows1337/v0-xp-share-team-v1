import { getSupabaseClient } from "../supabase-client"
import { config } from "../config"

export interface Embedding {
  id: string
  content: string
  embedding: number[]
  metadata: Record<string, any>
  created_at: string
}

export interface Cluster {
  id: string
  name: string
  center: number[]
  members: string[]
  created_at: string
}

// Mock-Daten für Entwicklung
const mockEmbeddings: Embedding[] = [
  {
    id: "emb-1",
    content: "Meditation im Schwarzwald",
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
    metadata: { category: "spirituality", location: "schwarzwald" },
    created_at: new Date().toISOString(),
  },
  {
    id: "emb-2",
    content: "Pasta-Kochkurs in Italien",
    embedding: [0.2, 0.3, 0.4, 0.5, 0.6],
    metadata: { category: "culinary", location: "italy" },
    created_at: new Date().toISOString(),
  },
]

const mockClusters: Cluster[] = [
  {
    id: "cluster-1",
    name: "Spirituelle Erlebnisse",
    center: [0.15, 0.25, 0.35, 0.45, 0.55],
    members: ["emb-1"],
    created_at: new Date().toISOString(),
  },
  {
    id: "cluster-2",
    name: "Kulinarische Erlebnisse",
    center: [0.25, 0.35, 0.45, 0.55, 0.65],
    members: ["emb-2"],
    created_at: new Date().toISOString(),
  },
]

export async function getAllEmbeddings(): Promise<Embedding[]> {
  if (config.useMockData) {
    return mockEmbeddings
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("embeddings").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Fehler beim Abrufen der Embeddings:", error)
    return []
  }
}

export async function storeEmbedding(embedding: Omit<Embedding, "id" | "created_at">): Promise<Embedding> {
  if (config.useMockData) {
    const newEmbedding: Embedding = {
      ...embedding,
      id: `emb-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    mockEmbeddings.push(newEmbedding)
    return newEmbedding
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("embeddings")
      .insert({
        ...embedding,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Fehler beim Speichern des Embeddings:", error)
    throw error
  }
}

export async function vectorSearch(queryEmbedding: number[], limit = 10): Promise<Embedding[]> {
  if (config.useMockData) {
    // Einfache Ähnlichkeitsberechnung für Mock-Daten
    const similarities = mockEmbeddings.map((emb) => ({
      embedding: emb,
      similarity: cosineSimilarity(queryEmbedding, emb.embedding),
    }))

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map((item) => item.embedding)
  }

  try {
    const supabase = getSupabaseClient()
    // Hier würde normalerweise eine Vektor-Ähnlichkeitssuche stattfinden
    // Für jetzt verwenden wir eine einfache Abfrage
    const { data, error } = await supabase.from("embeddings").select("*").limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Fehler bei der Vektorsuche:", error)
    return []
  }
}

export async function storeClusters(clusters: Omit<Cluster, "id" | "created_at">[]): Promise<Cluster[]> {
  if (config.useMockData) {
    const newClusters = clusters.map((cluster) => ({
      ...cluster,
      id: `cluster-${Date.now()}-${Math.random()}`,
      created_at: new Date().toISOString(),
    }))
    mockClusters.push(...newClusters)
    return newClusters
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("clusters")
      .insert(
        clusters.map((cluster) => ({
          ...cluster,
          created_at: new Date().toISOString(),
        })),
      )
      .select()

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Fehler beim Speichern der Cluster:", error)
    throw error
  }
}

export async function getClusters(): Promise<Cluster[]> {
  if (config.useMockData) {
    return mockClusters
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("clusters").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Fehler beim Abrufen der Cluster:", error)
    return []
  }
}

// Hilfsfunktion für Kosinus-Ähnlichkeit
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Weitere Hilfsfunktionen
export async function deleteEmbedding(id: string): Promise<void> {
  if (config.useMockData) {
    const index = mockEmbeddings.findIndex((emb) => emb.id === id)
    if (index > -1) {
      mockEmbeddings.splice(index, 1)
    }
    return
  }

  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.from("embeddings").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Fehler beim Löschen des Embeddings:", error)
    throw error
  }
}

export async function updateEmbedding(id: string, updates: Partial<Embedding>): Promise<Embedding> {
  if (config.useMockData) {
    const index = mockEmbeddings.findIndex((emb) => emb.id === id)
    if (index === -1) throw new Error("Embedding nicht gefunden")

    mockEmbeddings[index] = { ...mockEmbeddings[index], ...updates }
    return mockEmbeddings[index]
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("embeddings").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Embeddings:", error)
    throw error
  }
}
