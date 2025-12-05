import { ComingSoonPage } from "@/components/coming-soon";
import { Layout } from "lucide-react";

export default function TemplatesPage() {
  return (
    <ComingSoonPage
      title="Onze templates"
      subtitle="komen eraan"
      description="Binnenkort kunt u hier onze collectie professionele website templates bekijken. Kies het ontwerp dat perfect bij uw bedrijf past."
      icon={Layout}
    />
  );
}
