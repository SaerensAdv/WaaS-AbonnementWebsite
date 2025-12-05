import { ComingSoonPage } from "@/components/coming-soon";
import { Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <ComingSoonPage
      title="Cookie"
      subtitle="beleid"
      description="Wij werken aan ons cookiebeleid. Binnenkort vindt u hier alle informatie over welke cookies wij gebruiken en waarom."
      icon={Cookie}
    />
  );
}
