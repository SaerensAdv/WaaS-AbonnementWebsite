import { 
  BarChart3, 
  Globe, 
  TrendingUp, 
  Users, 
  Settings,
  Bell,
  Search,
  LayoutDashboard,
  FileText,
  CreditCard,
  MessageSquare,
  ChevronRight,
  Check,
  Clock,
  ArrowUpRight,
  Palette,
  Layers
} from "lucide-react";

interface DashboardMockupProps {
  variant?: "dashboard" | "builder" | "analytics";
  className?: string;
}

export function DashboardMockup({ variant = "dashboard", className = "" }: DashboardMockupProps) {
  if (variant === "builder") {
    return <BuilderMockup className={className} />;
  }
  
  if (variant === "analytics") {
    return <AnalyticsMockup className={className} />;
  }
  
  return (
    <div className={`bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl ${className}`}>
      <div className="flex">
        <div className="w-14 bg-slate-800/50 border-r border-slate-700 py-4 flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400">
            <FileText className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="h-12 bg-slate-800/30 border-b border-slate-700 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700/50 text-slate-400 text-xs">
                <Search className="w-3 h-3" />
                <span>Zoeken...</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-400" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-primary" />
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm">Welkom terug, Jan</h3>
                <p className="text-slate-400 text-xs">Hier is een overzicht van uw website</p>
              </div>
              <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Live
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <StatCard 
                label="Bezoekers" 
                value="2,847" 
                change="+12.5%" 
                positive 
              />
              <StatCard 
                label="Conversies" 
                value="156" 
                change="+8.2%" 
                positive 
              />
              <StatCard 
                label="Omzet" 
                value="€12.4K" 
                change="+23.1%" 
                positive 
              />
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300 text-xs font-medium">Bezoekers deze week</span>
                <span className="text-primary text-xs">+127%</span>
              </div>
              <div className="flex items-end gap-1 h-16">
                {[40, 55, 35, 65, 80, 60, 90].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-primary/60 to-primary rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-slate-500 text-[10px]">
                <span>Ma</span>
                <span>Di</span>
                <span>Wo</span>
                <span>Do</span>
                <span>Vr</span>
                <span>Za</span>
                <span>Zo</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-slate-300 text-xs font-medium">SEO Score</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">92/100</div>
              </div>
              <div className="flex-1 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-slate-300 text-xs font-medium">Uptime</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">99.9%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, positive }: { 
  label: string; 
  value: string; 
  change: string; 
  positive: boolean;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
      <div className="text-slate-400 text-xs mb-1">{label}</div>
      <div className="text-white font-bold text-lg font-mono">{value}</div>
      <div className={`text-xs ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </div>
    </div>
  );
}

function BuilderMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl ${className}`}>
      <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-slate-400 text-xs ml-2">Website Builder</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs">Preview</button>
          <button className="px-2 py-1 rounded bg-primary text-white text-xs">Publiceren</button>
        </div>
      </div>
      
      <div className="flex">
        <div className="w-12 bg-slate-800/50 border-r border-slate-700 py-3 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
            <Layers className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded bg-slate-700/50 flex items-center justify-center text-slate-400">
            <FileText className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded bg-slate-700/50 flex items-center justify-center text-slate-400">
            <Palette className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded bg-slate-700/50 flex items-center justify-center text-slate-400">
            <Settings className="w-4 h-4" />
          </div>
        </div>
        
        <div className="w-48 bg-slate-800/30 border-r border-slate-700 p-3">
          <div className="text-slate-300 text-xs font-medium mb-3">Componenten</div>
          <div className="space-y-2">
            {["Hero Sectie", "Over Ons", "Diensten", "Contact", "Footer"].map((item, i) => (
              <div 
                key={item}
                className={`p-2 rounded text-xs cursor-pointer transition-colors ${
                  i === 0 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 p-4 bg-slate-950/50">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="h-28 bg-gradient-to-r from-blue-600 to-primary relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <div className="text-lg font-bold mb-1">Uw Bedrijfsnaam</div>
                <div className="text-xs opacity-80">Premium website oplossing</div>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-3/4" />
              <div className="h-2 bg-slate-100 rounded w-full" />
              <div className="h-2 bg-slate-100 rounded w-5/6" />
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-16 bg-primary rounded text-[8px] text-white flex items-center justify-center">
                  Contact
                </div>
                <div className="h-6 w-16 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-44 bg-slate-800/30 border-l border-slate-700 p-3">
          <div className="text-slate-300 text-xs font-medium mb-3">Eigenschappen</div>
          <div className="space-y-3">
            <div>
              <label className="text-slate-500 text-[10px]">Achtergrond</label>
              <div className="flex gap-1 mt-1">
                {["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"].map((color) => (
                  <div 
                    key={color}
                    className="w-5 h-5 rounded border-2 border-slate-600 cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-500 text-[10px]">Lettertype</label>
              <select className="w-full mt-1 bg-slate-700 border border-slate-600 rounded text-slate-300 text-xs p-1">
                <option>Inter</option>
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-[10px]">Padding</label>
              <input 
                type="range" 
                className="w-full mt-1"
                defaultValue="50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl ${className}`}>
      <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-slate-400 text-xs">Google Ads Dashboard</div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">Advertentie Prestaties</h3>
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs">7 dagen</span>
            <span className="px-2 py-1 rounded bg-primary text-white text-xs">30 dagen</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-slate-400 text-xs">Impressies</div>
            <div className="text-white font-bold text-lg font-mono">45.2K</div>
            <div className="text-green-400 text-xs flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +18.3%
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-slate-400 text-xs">Klikken</div>
            <div className="text-white font-bold text-lg font-mono">1,847</div>
            <div className="text-green-400 text-xs flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +12.1%
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-slate-400 text-xs">CTR</div>
            <div className="text-white font-bold text-lg font-mono">4.09%</div>
            <div className="text-green-400 text-xs flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +0.8%
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-slate-400 text-xs">Kosten</div>
            <div className="text-white font-bold text-lg font-mono">€847</div>
            <div className="text-slate-400 text-xs">van €1.000 budget</div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 text-sm font-medium">Budget Verdeling</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Google Ads</span>
                <span className="text-white">€600 (60%)</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Meta Ads</span>
                <span className="text-white">€300 (30%)</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">SEO</span>
                <span className="text-white">€100 (10%)</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrustLogos({ className = "" }: { className?: string }) {
  const logos = [
    "Bakkerij van Dijk",
    "De Groene Tuin", 
    "Autoservice Plus",
    "Kapsalon Stijl",
    "Fysiotherapie Noord",
    "Restaurant De Smulhoek"
  ];
  
  return (
    <div className={`flex items-center justify-center gap-8 flex-wrap ${className}`}>
      {logos.map((name) => (
        <div 
          key={name}
          className="text-slate-400 dark:text-slate-500 font-semibold text-sm tracking-wide opacity-60 hover:opacity-100 transition-opacity"
        >
          {name}
        </div>
      ))}
    </div>
  );
}

export function PaymentMethods({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 flex-wrap ${className}`}>
      {["iDEAL", "Bancontact", "VISA", "Mastercard", "PayPal"].map((method) => (
        <div 
          key={method}
          className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium shadow-sm"
        >
          {method}
        </div>
      ))}
    </div>
  );
}
