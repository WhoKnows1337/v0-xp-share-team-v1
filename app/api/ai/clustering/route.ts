import { type NextRequest, NextResponse } from "next/server"
import { clusteringService } from "@/lib/ai/clustering-service"
import { getClusters } from "@/lib/ai/vector-database"

export async function GET(request: NextRequest) {
  try {
    const clusters = await getClusters()
    return NextResponse.json({ clusters })
  } catch (error) {
    console.error("Fehler beim Abrufen der Cluster:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { method = "kmeans", k = 5 } = await request.json()

    let clusters
    if (method === "kmeans") {
      clusters = await clusteringService.performKMeansClustering(k)
    } else if (method === "hierarchical") {
      clusters = await clusteringService.performHierarchicalClustering()
    } else {
      return NextResponse.json({ error: "Ungültige Clustering-Methode" }, { status: 400 })
    }

    // Speichere Cluster in DB
    await clusteringService.saveClusters(clusters)

    return NextResponse.json({ clusters })
  } catch (error) {
    console.error("Fehler beim Clustering:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
