import { useTheme } from "@/lib/theme-provider";
import dashboardLight from "@assets/generated_images/saas_dashboard_interface_mockup.png";
import dashboardDark from "@assets/generated_images/dark_mode_saas_dashboard_mockup.png";

interface ProductMockupProps {
  variant?: "light" | "dark" | "auto";
  className?: string;
}

export function ProductMockup({ variant = "auto", className = "" }: ProductMockupProps) {
  const { theme } = useTheme();
  
  const getImageSrc = () => {
    if (variant === "light") return dashboardLight;
    if (variant === "dark") return dashboardDark;
    
    if (theme === "dark") return dashboardDark;
    if (theme === "light") return dashboardLight;
    
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? dashboardDark
        : dashboardLight;
    }
    
    return dashboardLight;
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        transform: "perspective(1000px) rotateY(-5deg)",
        transformStyle: "preserve-3d",
      }}
      data-testid="product-mockup"
    >
      <div
        className="relative rounded-xl bg-slate-800 dark:bg-slate-900 p-2 shadow-2xl"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
        }}
      >
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-20 bg-slate-700 dark:bg-slate-800 rounded-b-lg flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-600 dark:bg-slate-700" />
          </div>
          
          <div className="rounded-lg overflow-hidden bg-slate-900">
            <img
              src={getImageSrc()}
              alt="Website Abonnement Dashboard - Beheer uw website en online marketing in één overzicht"
              className="w-full h-auto object-cover"
              data-testid="mockup-image"
            />
          </div>
        </div>
        
        <div
          className="mt-2 h-3 bg-slate-700 dark:bg-slate-800 rounded-b-xl mx-auto relative"
          style={{ width: "40%" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-slate-600 dark:bg-slate-700 rounded-full mx-4" />
        </div>
      </div>
      
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-slate-700/50 dark:bg-slate-600/30 rounded-full blur-sm"
        style={{ width: "80%" }}
      />
    </div>
  );
}
