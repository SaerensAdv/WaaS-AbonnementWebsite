import { ComingSoonPage } from "@/components/coming-soon";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <ComingSoonPage
      title="Neem contact"
      subtitle="met ons op"
      description="Binnenkort vindt u hier onze contactgegevens en een formulier om direct met ons in contact te komen. Voor nu kunt u ons bereiken via info@websiteabonnementen.nl."
      icon={Mail}
    />
  );
}
