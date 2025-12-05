import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { Search, TrendingUp } from "lucide-react";

interface BudgetCalculatorProps {
  className?: string;
}

export function BudgetCalculator({ className = "" }: BudgetCalculatorProps) {
  const [totalBudget, setTotalBudget] = useState(1000);
  const [googleSplit, setGoogleSplit] = useState(50);
  const [metaSplit, setMetaSplit] = useState(30);
  const [seoSplit, setSeoSplit] = useState(20);

  const googleBudget = Math.round(totalBudget * (googleSplit / 100));
  const metaBudget = Math.round(totalBudget * (metaSplit / 100));
  const seoBudget = Math.round(totalBudget * (seoSplit / 100));

  const estimatedClicks = Math.round(googleBudget / 0.45);
  const estimatedImpressions = Math.round(metaBudget * 150);
  const estimatedRanking = Math.min(95, 60 + Math.round(seoBudget / 10));

  return (
    <div className={`${className}`}>
      <Card className="bg-slate-900 border-slate-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Maandelijks Budget</h3>
                  <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate font-mono text-lg px-4 py-1">
                    {totalBudget.toLocaleString('nl-NL')}
                  </Badge>
                </div>
                <Slider
                  value={[totalBudget]}
                  onValueChange={(value) => setTotalBudget(value[0])}
                  min={250}
                  max={5000}
                  step={50}
                  className="w-full"
                  data-testid="slider-total-budget"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>250</span>
                  <span>5.000</span>
                </div>
              </div>

              <div className="space-y-6">
                <BudgetChannel
                  icon={<SiGoogle className="w-4 h-4" />}
                  name="Google Ads"
                  color="bg-blue-500"
                  percentage={googleSplit}
                  budget={googleBudget}
                  onChange={setGoogleSplit}
                  testId="slider-google"
                />
                <BudgetChannel
                  icon={<SiFacebook className="w-4 h-4" />}
                  name="Meta Ads"
                  color="bg-purple-500"
                  percentage={metaSplit}
                  budget={metaBudget}
                  onChange={setMetaSplit}
                  testId="slider-meta"
                />
                <BudgetChannel
                  icon={<Search className="w-4 h-4" />}
                  name="SEO"
                  color="bg-green-500"
                  percentage={seoSplit}
                  budget={seoBudget}
                  onChange={setSeoSplit}
                  testId="slider-seo"
                />
              </div>
            </div>

            <div className="bg-slate-800/50 p-8 border-l border-slate-700">
              <h3 className="text-white font-semibold mb-6">Geschatte Resultaten</h3>
              
              <div className="space-y-4">
                <ResultCard
                  label="Google Ads Klikken"
                  value={estimatedClicks.toLocaleString('nl-NL')}
                  subtext="per maand geschat"
                  trend="+12% vs. gem."
                  color="text-blue-400"
                />
                <ResultCard
                  label="Meta Impressies"
                  value={estimatedImpressions.toLocaleString('nl-NL')}
                  subtext="bereik per maand"
                  trend="+8% vs. gem."
                  color="text-purple-400"
                />
                <ResultCard
                  label="SEO Score"
                  value={`${estimatedRanking}/100`}
                  subtext="organische zichtbaarheid"
                  trend="Top 10%"
                  color="text-green-400"
                />
              </div>

              <div className="mt-6 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Geschatte ROI:</span>
                  <span className="font-bold text-white ml-auto font-mono">3.2x - 4.8x</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface BudgetChannelProps {
  icon: React.ReactNode;
  name: string;
  color: string;
  percentage: number;
  budget: number;
  onChange: (value: number) => void;
  testId: string;
}

function BudgetChannel({ icon, name, color, percentage, budget, onChange, testId }: BudgetChannelProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-white">
          <div className={`w-8 h-8 rounded-lg ${color} bg-opacity-20 flex items-center justify-center`}>
            {icon}
          </div>
          <span className="font-medium text-sm">{name}</span>
        </div>
        <div className="text-right">
          <span className="text-white font-bold font-mono">{budget}</span>
          <span className="text-slate-500 text-sm ml-1">({percentage}%)</span>
        </div>
      </div>
      <Slider
        value={[percentage]}
        onValueChange={(value) => onChange(value[0])}
        min={0}
        max={100}
        step={5}
        className="w-full"
        data-testid={testId}
      />
    </div>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
  subtext: string;
  trend: string;
  color: string;
}

function ResultCard({ label, value, subtext, trend, color }: ResultCardProps) {
  return (
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
      <div className="text-slate-400 text-xs mb-1">{label}</div>
      <div className="flex items-end justify-between">
        <div>
          <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
          <div className="text-slate-500 text-xs mt-1">{subtext}</div>
        </div>
        <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate text-green-400 bg-green-500/10 text-xs">
          {trend}
        </Badge>
      </div>
    </div>
  );
}
