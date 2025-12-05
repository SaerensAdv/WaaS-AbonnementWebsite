import { MarketingHeader } from "./marketing-header";

interface ComingSoonLayoutProps {
  children: React.ReactNode;
}

export function ComingSoonLayout({ children }: ComingSoonLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 -mt-[72px]">{children}</main>
    </div>
  );
}
