import ClientLayout from "../../client-layout"
import { Container } from "@/components/ui/container"
import { ReferralTodoList } from "@/components/referral/referral-todo-list"

export default function ReferralTodoPage() {
  return (
    <ClientLayout>
      <Container className="py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Referral-Programm To-Do Liste</h1>
            <p className="text-muted-foreground mt-2">
              Übersicht über den Implementierungsstatus des Referral-Programms
            </p>
          </div>

          <ReferralTodoList />
        </div>
      </Container>
    </ClientLayout>
  )
}
