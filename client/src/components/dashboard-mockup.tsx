import { 
  Globe, 
  TrendingUp, 
  Bell,
  Search,
  LayoutDashboard,
  FileText,
  CreditCard,
  Check,
  Clock,
  ArrowUpRight,
  Users,
  Eye,
  MousePointerClick,
  ShoppingCart,
  Activity,
  Calendar,
  BarChart3,
  Zap
} from "lucide-react";

interface DashboardMockupProps {
  variant?: "dashboard" | "results" | "timeline";
  className?: string;
}

export function DashboardMockup({ variant = "dashboard", className = "" }: DashboardMockupProps) {
  if (variant === "results") {
    return <ResultsMockup className={className} />;
  }
  
  if (variant === "timeline") {
    return <TimelineMockup className={className} />;
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
                <p className="text-slate-400 text-xs">Hier is een overzicht van uw website prestaties</p>
              </div>
              <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Website Live
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <StatCard 
                icon={Eye}
                label="Bezoekers" 
                value="2,847" 
                change="+12.5%" 
                positive 
              />
              <StatCard 
                icon={MousePointerClick}
                label="Conversies" 
                value="156" 
                change="+8.2%" 
                positive 
              />
              <StatCard 
                icon={ShoppingCart}
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
                    <Activity className="w-3 h-3 text-green-400" />
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

interface StatCardProps {
  icon: React.ElementType;
  label: string; 
  value: string; 
  change: string; 
  positive: boolean;
}

function StatCard({ icon: Icon, label, value, change, positive }: StatCardProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-slate-400 text-xs">{label}</span>
      </div>
      <div className="text-white font-bold text-lg font-mono">{value}</div>
      <div className={`text-xs flex items-center gap-1 ${positive ? 'text-green-400' : 'text-red-400'}`}>
        <ArrowUpRight className="w-3 h-3" />
        {change}
      </div>
    </div>
  );
}

function ResultsMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl ${className}`}>
      <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-slate-400 text-xs">Maandelijkse Resultaten - December 2024</div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Uw Website Prestaties</h3>
            <p className="text-slate-400 text-sm">Door onze specialisten beheerd</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            Alle doelen behaald
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            icon={Users}
            label="Website Bezoekers"
            value="4,847"
            subtext="Deze maand"
            change="+34%"
            changeLabel="vs. vorige maand"
          />
          <ResultCard
            icon={MousePointerClick}
            label="Leads Gegenereerd"
            value="127"
            subtext="Nieuwe contacten"
            change="+28%"
            changeLabel="vs. vorige maand"
          />
          <ResultCard
            icon={TrendingUp}
            label="Google Ranking"
            value="#3"
            subtext="Voor hoofdzoekwoord"
            change="+5"
            changeLabel="posities gestegen"
          />
          <ResultCard
            icon={ShoppingCart}
            label="Omzet via Website"
            value="€18.4K"
            subtext="Totale waarde"
            change="+41%"
            changeLabel="vs. vorige maand"
          />
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-white font-medium">Volgende optimalisaties gepland</div>
              <div className="text-slate-400 text-sm">Uw specialist werkt aan 3 verbeteringen</div>
            </div>
          </div>
          <div className="space-y-2 pl-13">
            {[
              "Homepage laadtijd optimalisatie",
              "Nieuwe SEO content voor blogpagina",
              "Google Ads campagne verfijning"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResultCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  change: string;
  changeLabel: string;
}

function ResultCard({ icon: Icon, label, value, subtext, change, changeLabel }: ResultCardProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-slate-300 text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white font-mono mb-1">{value}</div>
      <div className="text-slate-500 text-xs mb-2">{subtext}</div>
      <div className="flex items-center gap-1 text-green-400 text-sm">
        <ArrowUpRight className="w-3 h-3" />
        <span className="font-medium">{change}</span>
        <span className="text-slate-500">{changeLabel}</span>
      </div>
    </div>
  );
}

function TimelineMockup({ className = "" }: { className?: string }) {
  const steps = [
    { 
      day: "Dag 1-2", 
      title: "Kennismaking & Briefing", 
      description: "U vertelt over uw bedrijf, wij maken een plan",
      status: "completed"
    },
    { 
      day: "Dag 3-5", 
      title: "Website Ontwerp", 
      description: "Ons team ontwerpt uw website op maat",
      status: "completed"
    },
    { 
      day: "Dag 6-8", 
      title: "Development & Content", 
      description: "Website wordt gebouwd met uw content",
      status: "current"
    },
    { 
      day: "Dag 9-10", 
      title: "Review & Lancering", 
      description: "U keurt goed, wij lanceren live",
      status: "upcoming"
    },
  ];

  return (
    <div className={`bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl ${className}`}>
      <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-slate-400 text-xs">Project Voortgang - De Vries Bouw</div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold">Uw Website Wordt Gebouwd</h3>
            <p className="text-slate-400 text-sm">Geen actie vereist - wij regelen alles</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white font-mono">75%</div>
            <div className="text-slate-400 text-xs">Voortgang</div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-700" />
          
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="relative pl-10">
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-500' 
                    : step.status === 'current'
                    ? 'bg-primary animate-pulse'
                    : 'bg-slate-700'
                }`}>
                  {step.status === 'completed' ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : step.status === 'current' ? (
                    <Clock className="w-4 h-4 text-white" />
                  ) : (
                    <Calendar className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                
                <div className={`bg-slate-800/50 rounded-lg p-4 border ${
                  step.status === 'current' ? 'border-primary' : 'border-slate-700'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{step.title}</span>
                    <span className="text-slate-500 text-xs">{step.day}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
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

export function PartnerBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium">Cookie Compliant met</span>
      </div>
      <span className="text-sm font-bold text-primary">ConsentEase.io</span>
    </div>
  );
}
