import { ToggleMockData } from "@/components/debug/toggle-mock-data"

export default function ToggleMockDataPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Debug-Einstellungen</h1>
      <div className="max-w-md">
        <ToggleMockData />
      </div>
    </div>
  )
}
