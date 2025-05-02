import { Suspense } from "react"
import { EntdeckenPageRedesigned } from "@/components/entdecken/entdecken-page-redesigned"
import Loading from "@/app/loading"

export default function EntdeckenPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EntdeckenPageRedesigned />
    </Suspense>
  )
}
