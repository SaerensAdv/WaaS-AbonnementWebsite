import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, ChevronLeft, Compass, Globe2, MessageCircle, Sparkles } from "lucide-react";

const routes = [
  { id: "starter", label: "Ik wil starten", note: "Een heldere basis die meteen werkt", icon: Compass },
  { id: "grow", label: "Ik wil groeien", note: "Meer aanvragen, minder gedoe", icon: Sparkles },
  { id: "refresh", label: "Ik wil vernieuwen", note: "Een merk dat weer vooruit voelt", icon: Globe2 },
];

const details: Record<string, { eyebrow: string; title: string; body: string; price: string; accent: string }> = {
  starter: {
    eyebrow: "De heldere start",
    title: "Een website die meteen vertrouwen geeft.",
    body: "Voor ondernemers met een goed verhaal, maar nog geen plek die het vertelt.",
    price: "€69 / maand",
    accent: "#e56b50",
  },
  grow: {
    eyebrow: "De groeiversneller",
    title: "Maak van aandacht een aanvraag.",
    body: "Voor teams die klaar zijn met losse marketingacties en een site willen die meewerkt.",
    price: "€69 / maand",
    accent: "#c56a32",
  },
  refresh: {
    eyebrow: "De nieuwe jas",
    title: "Laat zien waar je nu staat.",
    body: "Voor merken die veranderd zijn, terwijl hun website is blijven hangen.",
    price: "€69 / maand",
    accent: "#6f7f63",
  },
};

export function PlanBuilder() {
  const [selected, setSelected] = useState("starter");
  const [submitted, setSubmitted] = useState(false);
  const active = useMemo(() => details[selected], [selected]);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#f4efe7] text-[#24302d]"
      style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="pointer-events-none absolute -right-24 -top-32 h-[34rem] w-[34rem] rounded-full border-[1.5rem] border-[#e7ded1] opacity-70" />
      <div className="pointer-events-none absolute bottom-[-15rem] left-[-8rem] h-[35rem] w-[35rem] rounded-full bg-[#dce4d7] opacity-70" />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-12">
        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#24302d] text-[#f4efe7]">W</span>
          Webatelier
        </div>
        <div className="hidden items-center gap-8 text-xs font-semibold text-[#68716d] md:flex">
          <span>Hoe het werkt</span>
          <span>Voorbeelden</span>
          <span>Veelgestelde vragen</span>
        </div>
        <button
          onClick={() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })}
          className="rounded-full border border-[#b8b9ad] px-4 py-2 text-xs font-bold transition-colors hover:bg-[#24302d] hover:text-[#f4efe7]"
        >
          Vind jouw route
        </button>
      </nav>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-14 px-6 pb-16 pt-8 md:px-12 lg:grid-cols-[1fr_0.86fr] lg:gap-20 lg:pb-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#e56b50]">
            <span className="h-px w-10 bg-[#e56b50]" /> Geen contract. Wel richting.
          </div>
          <h1 className="max-w-3xl text-[clamp(3.4rem,8vw,7.8rem)] font-semibold leading-[0.91] tracking-[-0.075em]">
            Niet zomaar
            <em className="block font-serif font-normal text-[#e56b50]">een website.</em>
            Een volgende stap.
          </h1>
          <p className="mt-8 max-w-md text-base leading-7 text-[#68716d] md:text-lg">
            Kies wat er nu speelt. Wij vertalen het naar een scherpe website, een vast bedrag en een team dat naast je blijft staan.
          </p>
          <div className="mt-10 flex items-center gap-5 text-xs font-bold uppercase tracking-[0.16em] text-[#68716d]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce4d7] text-[#5d725f]">01</span>
            <span>Jij kiest de richting</span>
            <ArrowRight className="h-4 w-4 text-[#e56b50]" />
            <span className="hidden sm:inline">Wij maken het concreet</span>
          </div>
        </motion.div>

        <motion.div
          id="builder"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-[2rem] border border-[#d8d2c7] bg-[#fbf8f2]/90 p-5 shadow-[0_24px_70px_rgba(71,66,55,0.12)] backdrop-blur md:p-7"
        >
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a9388]">Stap 01 / 02</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Waar ben je naar op zoek?</h2>
            </div>
            <MessageCircle className="h-5 w-5 text-[#e56b50]" />
          </div>
          <div className="space-y-3">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = selected === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => { setSelected(route.id); setSubmitted(false); }}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${isActive ? "border-[#e56b50] bg-[#fff1e9] shadow-[0_8px_20px_rgba(229,107,80,0.1)]" : "border-[#e1dbd0] bg-transparent hover:border-[#b8b9ad]"}`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isActive ? "bg-[#e56b50] text-[#fff8f2]" : "bg-[#e9e5dc] text-[#68716d]"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <strong className="block text-sm">{route.label}</strong>
                    <span className="mt-1 block text-xs text-[#8a8980]">{route.note}</span>
                  </span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${isActive ? "border-[#e56b50] bg-[#e56b50] text-white" : "border-[#c8c6bd]"}`}>
                    {isActive && <Check className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={selected} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-7 border-t border-[#e1dbd0] pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: active.accent }}>{active.eyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.04em]">{active.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68716d]">{active.body}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-bold">{active.price}</span>
                <button onClick={() => setSubmitted(true)} className="flex items-center gap-2 rounded-full bg-[#24302d] px-5 py-3 text-xs font-bold text-[#f4efe7] transition-transform hover:scale-[1.03]">
                  {submitted ? "Aangevraagd" : "Dit past bij mij"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-7 flex items-center gap-2 text-[11px] text-[#8a8980]"><ChevronLeft className="h-3 w-3 rotate-[-90deg]" /> Binnen 10 werkdagen live · inclusief hosting</div>
        </motion.div>
      </section>
    </main>
  );
}

export default PlanBuilder;