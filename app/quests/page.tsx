import { QuestDashboard } from "@/components/gamification/quest-dashboard"
import { mockQuests } from "@/lib/mock-gamification"

export default function QuestsPage() {
  return <QuestDashboard quests={mockQuests} />
}
