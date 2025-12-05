import { ComingSoonPage } from "@/components/coming-soon";
import { Users } from "lucide-react";

export default function AboutPage() {
  return (
    <ComingSoonPage
      title="We werken aan"
      subtitle="deze pagina"
      description="Ons team is druk bezig om deze pagina voor u klaar te maken. Binnenkort vindt u hier meer informatie over wie wij zijn."
      icon={Users}
    />
  );
}
