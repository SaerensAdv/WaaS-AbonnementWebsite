import { ComingSoonPage } from "@/components/coming-soon";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <ComingSoonPage
      title="Algemene"
      subtitle="voorwaarden"
      description="Onze algemene voorwaarden worden momenteel opgesteld. Binnenkort vindt u hier alle informatie over onze dienstverlening."
      icon={FileText}
    />
  );
}
