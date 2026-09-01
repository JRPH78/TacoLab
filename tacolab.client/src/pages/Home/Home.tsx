import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import TacoMolecule from "./components/TacoMolecule";

const NEGRO = "#0B0B0A";
const PAPEL = "#F4EFE3";
const REACTIVO = "#3ECF6E";
const FUEGO = "#E8481C";
const NEON = "#F5B700";
const OUTFIT = "'Outfit', sans-serif";
const MONO = "'IBM Plex Mono', monospace";
// Fuente manuscrita para las "notas al margen". Añade el import de Google Fonts
// (Caveat) en tu <head> / _document — aquí solo se referencia con fallback cursive.
const HAND = "'Caveat', cursive";

/** Revela una sección al entrar en el viewport, una sola vez. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-10 ease-out ${
        visible ? "opacity-200 translate-y-0" : "opacity-0 translate-y-16"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Ícono tipo "reactor de laboratorio": anillos, cruz de ejes y núcleo. */
function ReactorIcon({ color, size = 64 }: { color: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      style={{ width: size, height: size, color }}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="50" cy="50" r="45" strokeOpacity="0.2" />
      <circle
        cx="50"
        cy="50"
        r="38"
        strokeDasharray="4 3"
        className="origin-center animate-spin"
        style={{ animationDuration: "10s" }}
      />
      <path d="M50 18 L50 34 M82 50 L66 50 M50 82 L50 66 M18 50 L34 50" strokeWidth="3" />
      <path
        d="M35 35 L65 35 L65 65 L35 65 Z"
        fill="currentColor"
        fillOpacity="0.15"
        strokeWidth="1"
      />
      <circle cx="50" cy="50" r="7" fill="currentColor" className="animate-pulse" />
    </svg>
  );
}

/** Una casilla de tabla periódica: número atómico, símbolo y nombre. */
function ElementTile({
  symbol,
  number,
  label,
  color,
  compact = false,
  detail,
  active = false,
  onEnter,
  onLeave,
}: {
  symbol: string;
  number: number;
  label: string;
  color: string;
  compact?: boolean;
  detail?: string;
  active?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  if (compact) {
    return (
      <div
        className="flex h-8 w-8 items-center justify-center rounded border"
        style={{ borderColor: color, backgroundColor: NEGRO }}
      >
        <span className="text-xs font-black" style={{ color, fontFamily: OUTFIT }}>
          {symbol}
        </span>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="flex h-24 w-20 cursor-pointer flex-col items-start justify-between rounded-xl border p-2.5 transition-all duration-200"
      style={{
        borderColor: color,
        backgroundColor: active ? `${color}14` : NEGRO,
        transform: active ? "translateY(-4px) scale(1.05)" : "none",
        boxShadow: active ? `0 8px 24px -8px ${color}` : "none",
      }}
      title={detail}
    >
      <span className="text-[10px] font-medium" style={{ color, fontFamily: MONO }}>
        {number}
      </span>
      <span
        className="w-full text-center text-3xl font-black"
        style={{ color, fontFamily: OUTFIT }}
      >
        {symbol}
      </span>
      <span
        className="w-full text-center text-[8px] font-medium uppercase tracking-wide"
        style={{ color, fontFamily: MONO }}
      >
        {label}
      </span>
    </div>
  );
}

const ELEMENTOS = [
  { symbol: "K", number: 19, label: "potasio", color: NEON },
  { symbol: "B", number: 5, label: "boro", color: NEON },
  { symbol: "C", number: 6, label: "carbono", color: REACTIVO },
  { symbol: "P", number: 15, label: "fósforo", color: REACTIVO },
];

/** Logotipo de la marca: K · B · C · P, como casillas de tabla periódica. */
function PeriodicLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex items-center gap-1.5" : "flex items-center gap-3"}>
      {ELEMENTOS.map((el) => (
        <ElementTile key={el.symbol} {...el} compact={compact} />
      ))}
    </div>
  );
}

/** La carta de ingredientes, tratada como tabla periódica: el signature element de la página. */
const INGREDIENTES = [
  {
    symbol: "TO",
    number: 1,
    label: "tortilla",
    color: PAPEL,
    detail: "Maíz nixtamalizado, prensado al momento.",
  },
  {
    symbol: "CA",
    number: 2,
    label: "carne",
    label2: "carne asada",
    color: FUEGO,
    detail: "Corte de res, 6h de marinado ácido.",
  },
  {
    symbol: "CE",
    number: 3,
    label: "cebolla",
    color: PAPEL,
    detail: "Blanca, cortada en cubo fino.",
  },
  {
    symbol: "CI",
    number: 4,
    label: "cilantro",
    color: REACTIVO,
    detail: "Fresco, picado justo antes de servir.",
  },
  {
    symbol: "SA",
    number: 5,
    label: "salsa",
    color: FUEGO,
    detail: "Chile de árbol tatemado, pH controlado.",
  },
  {
    symbol: "LI",
    number: 6,
    label: "limón",
    color: NEON,
    detail: "Ácido cítrico natural, exprimido al plato.",
  },
  { symbol: "QU", number: 7, label: "queso", color: PAPEL, detail: "Fundido a 68°C exactos." },
  {
    symbol: "AG",
    number: 8,
    label: "aguacate",
    color: REACTIVO,
    detail: "Punto de maduración medido a diario.",
  },
  {
    symbol: "CH",
    number: 9,
    label: "chile",
    color: FUEGO,
    detail: "Serrano toreado, picor calibrado.",
  },
  {
    symbol: "MZ",
    number: 10,
    label: "maíz",
    color: NEON,
    detail: "Grano base de toda la fórmula.",
  },
  { symbol: "NA", number: 11, label: "sal", color: PAPEL, detail: "De mar, en dosis exacta." },
  {
    symbol: "PI",
    number: 12,
    label: "piña",
    color: NEON,
    detail: "Asada al carbón, para el equilibrio dulce.",
  },
];

function IngredientTable() {
  const [active, setActive] = useState<number | null>(null);
  const activo = INGREDIENTES.find((i) => i.number === active) ?? null;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {INGREDIENTES.map((el) => (
          <ElementTile
            key={el.symbol}
            symbol={el.symbol}
            number={el.number}
            label={el.label}
            color={el.color}
            detail={el.detail}
            active={active === el.number}
            onEnter={() => setActive(el.number)}
            onLeave={() => setActive(null)}
          />
        ))}
      </div>
      <div
        className="mt-6 flex h-10 items-center justify-center border-t px-4 text-center text-xs sm:justify-start sm:text-left"
        style={{ borderColor: "rgba(244,239,227,0.12)", fontFamily: MONO }}
      >
        <span style={{ color: activo ? activo.color : "rgba(244,239,227,0.35)" }}>
          {activo
            ? `${activo.label.toUpperCase()} — ${activo.detail}`
            : "pasa el cursor sobre un ingrediente para ver su ficha"}
        </span>
      </div>
    </div>
  );
}

function CornerFrame() {
  const base = "absolute w-16 h-16 border-current";
  const color = "rgba(62,207,110,0.25)";
  return (
    <div className="pointer-events-none fixed inset-0 z-60" style={{ color }}>
      <div className={`${base} top-6 left-6 border-t-2 border-l-2`} />
      <div className={`${base} top-6 right-6 border-t-2 border-r-2`} />
      <div className={`${base} bottom-6 left-6 border-b-2 border-l-2`} />
      <div className={`${base} bottom-6 right-6 border-b-2 border-r-2`} />
    </div>
  );
}

function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-55 opacity-[0.06]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, transparent 1px, transparent 2px)",
      }}
    />
  );
}

/** Textura de cuaderno de laboratorio: retícula milimetrada, casi invisible. */
function NotebookGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]"
      style={{
        backgroundImage: `linear-gradient(${REACTIVO} 1px, transparent 1px), linear-gradient(90deg, ${REACTIVO} 1px, transparent 1px)`,
        backgroundSize: "34px 34px",
      }}
    />
  );
}

function Watermark({ label, top }: { label: string; top: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none text-[38vw] font-black italic leading-none md:text-[22vw]"
      style={{ top, color: PAPEL, opacity: 0.035, fontFamily: OUTFIT }}
    >
      {label}
    </span>
  );
}

/** Nota manuscrita al margen, como una anotación real en un cuaderno de laboratorio. */
function MarginNote({
  children,
  color = REACTIVO,
  rotate = -4,
  className = "",
}: {
  children: ReactNode;
  color?: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none select-none text-xl leading-none ${className}`}
      style={{ color, fontFamily: HAND, transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}

/** Fórmula química flotante, como grafiti de cuaderno detrás del contenido. */
function FormulaGhost({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none text-sm tracking-wide opacity-[0.14] ${className}`}
      style={{ fontFamily: MONO, color: REACTIVO }}
    >
      {children}
    </span>
  );
}

/** Lectura tipo osciloscopio: reemplaza al número plano por una onda de laboratorio que se traza sola. */
function LabReadout({ label, value, accent }: { label: string; value: string; accent: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const points = "0,26 14,9 28,20 42,5 56,17 70,3 84,19 98,8 112,23 126,6 140,18 158,11";
  const pathLen = 260;

  return (
    <div ref={ref}>
      <span
        className="mb-2 block text-[10px] font-bold uppercase tracking-widest"
        style={{ color: accent, fontFamily: MONO }}
      >
        {label}
      </span>
      <svg viewBox="0 0 160 32" className="mb-1 h-6 w-full">
        <polyline
          points={points}
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={visible ? 0 : pathLen}
          style={{ transition: "stroke-dashoffset 1300ms ease-out 150ms" }}
        />
        <circle
          cx={visible ? 158 : 0}
          cy={visible ? 11 : 26}
          r="2.5"
          fill={accent}
          style={{ transition: "cx 1300ms ease-out 150ms, cy 1300ms ease-out 150ms" }}
        />
      </svg>
      <span className="text-3xl font-bold italic" style={{ fontFamily: OUTFIT, color: PAPEL }}>
        {value}
      </span>
    </div>
  );
}

/** Overlay de arranque: la fórmula se ensambla átomo por átomo antes de revelar el sitio. */
function IntroSequence({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center transition-opacity duration-10000 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ backgroundColor: NEGRO }}
      aria-hidden={!visible}
    >
      <TacoMolecule size={220} mounted={visible} interactive={false} />
      <span
        className="mt-6 text-[10px] uppercase tracking-[0.5em]"
        style={{ color: REACTIVO, fontFamily: MONO }}
      >
        ensamblando fórmula
      </span>
    </div>
  );
}

export default function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [heroMounted, setHeroMounted] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [scrollP, setScrollP] = useState(0);

  useEffect(() => {
    document.body.style.overflow = introVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introVisible]);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroVisible(false), 1500);
    const t2 = setTimeout(() => setHeroMounted(true), 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 0.85)));
      setScrollP(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full selection:bg-[#3ECF6E]/30 selection:text-white"
      style={{ backgroundColor: NEGRO, color: PAPEL, fontFamily: "'Inter', sans-serif" }}
    >
      <IntroSequence visible={introVisible} />

      {/* viñeta radial */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle at center, #1a1a17 0%, ${NEGRO} 70%)`,
        }}
      />
      <NotebookGrid />
      <Grain />
      <CornerFrame />

      {/* NAV flotante, discreto */}
      <header className="fixed top-0 z-70 w-full">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <PeriodicLogo compact />
            <span
              className="hidden text-sm font-black uppercase italic tracking-widest sm:inline"
              style={{ fontFamily: OUTFIT, color: PAPEL }}
            >
              El Taco <span style={{ color: NEON }}>Lab</span>
            </span>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="text" sx={{ color: PAPEL, textTransform: "none", fontWeight: 500 }}>
              Iniciar sesión
            </Button>
            {/* <Button
              variant="contained"
              endIcon={<ArrowOutwardIcon sx={{ fontSize: 15 }} />}
              sx={{
                backgroundColor: FUEGO,
                color: PAPEL,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { backgroundColor: "#c53c16" },
              }}
            >
              Solicitar demo
            </Button> */}
          </div>

          <IconButton
            className="md:hidden"
            onClick={() => setMenuAbierto(!menuAbierto)}
            sx={{ color: PAPEL }}
            aria-label="Abrir menú"
          >
            {menuAbierto ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </nav>

        {menuAbierto && (
          <div
            className="flex flex-col gap-4 px-8 pb-6 md:hidden"
            style={{ backgroundColor: NEGRO }}
          >
            {/* <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: FUEGO,
                color: PAPEL,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Solicitar demo
            </Button> */}
            <Button variant="text" sx={{ color: PAPEL, textTransform: "none" }}>
              Iniciar sesión
            </Button>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* HERO — la molécula ocupa todo el fondo y reacciona al scroll */}
        <section className="relative flex min-h-[112vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
          <Watermark label="KBCP" top="6%" />
          <TacoMolecule ambient mounted={heroMounted} reactProgress={scrollP} />

          <div className="relative max-w-3xl">
            <h1
              className="text-[13vw] font-black uppercase italic leading-[0.95] tracking-tighter md:text-7xl"
              style={{ fontFamily: OUTFIT, color: PAPEL }}
            >
              El sabor
              <br />
              tiene <span style={{ color: NEON }}>fórmula</span>
            </h1>

            <p
              className="mx-auto mt-8 mb-2 max-w-md text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              El sistema de administración para taquerías que operan con la precisión de un
              laboratorio, sin perder el fuego de lo hecho a mano.
            </p>
            <div
              className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs"
              style={{ borderColor: "rgba(62,207,110,0.4)", color: REACTIVO, fontFamily: MONO }}
            >
              <span>C₁₈H₃₄O₂</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>fórmula del taco</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              {/* <Button
                variant="contained"
                size="large"
                endIcon={<ArrowOutwardIcon sx={{ fontSize: 16 }} />}
                sx={{
                  backgroundColor: FUEGO,
                  color: PAPEL,
                  textTransform: "none",
                  fontWeight: 700,
                  px: 4,
                  "&:hover": { backgroundColor: "#c53c16" },
                }}
              >
                Solicitar demo
              </Button> */}
              <Button
                variant="contained"
                size="large"
                sx={{
                  // borderColor: "rgba(244,239,227,0.3)",
                  backgroundColor: FUEGO,

                  color: PAPEL,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  "&:hover": { borderColor: PAPEL },
                }}
              >
                Iniciar sesión
              </Button>
            </div>
          </div>

          <div className="absolute bottom-15 flex flex-col items-center gap-3 opacity-60">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.5em]"
              style={{ color: NEON, fontFamily: MONO }}
            >
              Baja
            </span>
            <div
              className="relative h-12 w-px overflow-hidden"
              style={{ backgroundColor: "rgba(62,207,110,0.25)" }}
            >
              <div
                className="absolute left-0 top-0 h-1/2 w-full animate-bounce"
                style={{ backgroundColor: PAPEL, opacity: 0.5 }}
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN 00 — la tabla periódica del menú, elemento signature de la página */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 md:px-24">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 top-10 select-none text-[26vw] font-black italic leading-none md:text-[14vw]"
            style={{ color: REACTIVO, opacity: 0.05, fontFamily: OUTFIT }}
          >
            00
          </span>
          <Reveal className="relative z-10 w-full max-w-3xl">
            <div className="mb-10 text-center">
              <span
                className="mb-3 block text-[10px] font-bold uppercase tracking-[0.4em]"
                style={{ color: REACTIVO, fontFamily: MONO }}
              >
                tabla de ingredientes
              </span>
              <h2
                className="text-5xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-6xl"
                style={{ fontFamily: OUTFIT, color: PAPEL }}
              >
                El menú, elemento
                <br />
                por elemento
              </h2>
            </div>
            <IngredientTable />
          </Reveal>
        </section>

        {/* SECCIÓN 01 — alineada a la derecha */}
        <section className="relative flex min-h-screen items-center justify-end overflow-hidden px-8 md:px-24">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 select-none text-[30vw] font-black italic leading-none md:text-[18vw]"
            style={{ color: FUEGO, opacity: 0.07, fontFamily: OUTFIT }}
          >
            01
          </span>
          <FormulaGhost className="left-10 top-16 -rotate-6">
            C₆H₈O₇ + limón → equilibrio
          </FormulaGhost>

          <Reveal className="relative z-10 max-w-lg text-right">
            <h2
              className="mb-8 text-5xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-6xl"
              style={{ fontFamily: OUTFIT, color: PAPEL }}
            >
              Ingredientes
              <br />
              activos
            </h2>
            <div
              className="relative rounded-3xl border p-10"
              style={{ borderColor: "rgba(244,239,227,0.12)" }}
            >
              <p
                className="mb-10 text-sm leading-relaxed"
                style={{ color: "rgba(244,239,227,0.7)" }}
              >
                Cada turno arranca con inventario controlado: sabes qué entra, qué se consume y qué
                falta antes de que falte, con la misma exactitud con la que se mide un reactivo.
              </p>
              <div
                className="grid grid-cols-2 gap-8 border-t pt-8"
                style={{ borderColor: "rgba(244,239,227,0.15)" }}
              >
                <LabReadout label="Merma" value="-32%" accent={REACTIVO} />
                <LabReadout label="Stock en vivo" value="ACTIVO" accent={NEON} />
              </div>
              <MarginNote className="absolute -left-16 top-6 hidden md:block" rotate={-8}>
                récord del mes ↴
              </MarginNote>
            </div>
          </Reveal>
        </section>

        {/* SECCIÓN 02 — alineada a la izquierda */}
        <section className="relative flex min-h-screen items-center justify-start overflow-hidden px-8 md:px-24">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 select-none text-[30vw] font-black italic leading-none md:text-[18vw]"
            style={{ color: REACTIVO, opacity: 0.06, fontFamily: OUTFIT }}
          >
            02
          </span>
          <FormulaGhost className="bottom-16 right-10 rotate-3">
            4 pasos · Δt constante
          </FormulaGhost>

          <Reveal className="relative z-10 max-w-lg">
            <h2
              className="mb-8 text-5xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-6xl"
              style={{ fontFamily: OUTFIT, color: PAPEL }}
            >
              El protocolo
              <br />
              de servicio
            </h2>
            <div
              className="rounded-3xl border p-10"
              style={{ borderColor: "rgba(244,239,227,0.12)" }}
            >
              <p
                className="mb-10 text-sm leading-relaxed"
                style={{ color: "rgba(244,239,227,0.7)" }}
              >
                Pedido, cocina, control de calidad y cierre: cuatro pasos cronometrados para que
                cada mesa reciba el mismo resultado, sin importar quién esté en turno.
              </p>
              <div
                className="grid grid-cols-2 gap-8 border-t pt-8"
                style={{ borderColor: "rgba(244,239,227,0.15)" }}
              >
                <LabReadout label="Tiempo de reacción" value="4.2 min" accent={NEON} />
                <LabReadout label="Consistencia" value="98%" accent={REACTIVO} />
              </div>
            </div>
          </Reveal>
        </section>

        {/* SECCIÓN 03 — resultados, alineada a la derecha */}
        <section className="relative flex min-h-screen items-center justify-end overflow-hidden px-8 md:px-24">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 select-none text-[30vw] font-black italic leading-none md:text-[18vw]"
            style={{ color: NEON, opacity: 0.07, fontFamily: OUTFIT }}
          >
            03
          </span>

          <Reveal className="relative z-10 max-w-lg text-right">
            <h2
              className="mb-8 text-5xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-6xl"
              style={{ fontFamily: OUTFIT, color: PAPEL }}
            >
              Resultados
              <br />
              que se sirven
            </h2>
            <div
              className="relative rounded-3xl border p-10"
              style={{ borderColor: "rgba(244,239,227,0.12)" }}
            >
              <p
                className="mb-10 text-sm leading-relaxed"
                style={{ color: "rgba(244,239,227,0.7)" }}
              >
                Datos, no corazonadas: cada corte de caja llega con el reporte del día listo, para
                decidir sin adivinar.
              </p>
              <div
                className="grid grid-cols-2 gap-8 border-t pt-8"
                style={{ borderColor: "rgba(244,239,227,0.15)" }}
              >
                <LabReadout label="Tickets por semana" value="1,200+" accent={FUEGO} />
                <LabReadout label="Pedido a mesa" value="4.2 min" accent={REACTIVO} />
              </div>
              <MarginNote className="absolute -right-6 -top-10 hidden md:block" rotate={6}>
                ¡nuevo máximo!
              </MarginNote>
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowOutwardIcon sx={{ fontSize: 16 }} />}
                sx={{
                  backgroundColor: NEON,
                  color: NEGRO,
                  textTransform: "none",
                  fontWeight: 700,
                  px: 4,
                  "&:hover": { backgroundColor: "#d7a334" },
                }}
              >
                Solicitar demo
              </Button>
            </div>
          </Reveal>
        </section>

        {/* CIERRE — declaración final, centrada */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
          <Reveal className="flex flex-col items-center">
            <ReactorIcon color={REACTIVO} size={72} />
            <h3
              className="mt-8 text-3xl font-black uppercase italic tracking-widest md:text-5xl"
              style={{ fontFamily: OUTFIT, color: PAPEL }}
            >
              El lugar donde el sabor
              <br />
              <span style={{ color: NEON }}>se experimenta</span>
            </h3>
            <p className="mt-6 max-w-sm text-sm" style={{ color: "rgba(244,239,227,0.55)" }}>
              Fórmula exacta, único sabor. Así opera El Taco Lab.
            </p>
          </Reveal>
        </section>
      </main>

      <div
        className="pointer-events-none fixed bottom-8 right-10 z-70 select-none italic"
        style={{ fontFamily: OUTFIT }}
      >
        <div className="flex items-center gap-3">
          <div className="h-px w-10" style={{ backgroundColor: "rgba(62,207,110,0.3)" }} />
          <span
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "rgba(244,239,227,0.35)" }}
          >
            El Taco <span style={{ color: NEON }}>Lab</span>
          </span>
        </div>
      </div>
    </div>
  );
}
