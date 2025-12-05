import { ComingSoonPage } from "@/components/coming-soon";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <ComingSoonPage
      title="Uw privacy"
      subtitle="is belangrijk"
      description="Wij werken aan ons privacybeleid. Binnenkort vindt u hier alle informatie over hoe wij met uw gegevens omgaan."
      icon={Shield}
    />
  );
}
