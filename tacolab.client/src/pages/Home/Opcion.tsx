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
      className={`transition-all duration-1100ms ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
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
}: {
  symbol: string;
  number: number;
  label: string;
  color: string;
  compact?: boolean;
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
      className="flex h-24 w-20 flex-col items-start justify-between rounded-xl border p-2.5"
      style={{ borderColor: color, backgroundColor: NEGRO }}
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

function Watermark({ label, top }: { label: string; top: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none text-[38vw] font-black italic leading-none md:text-[22vw]"
      style={{ top, color: PAPEL, opacity: 0.035, fontFamily: OUTFIT }}
    >
      {label}
      <PeriodicLogo />
    </span>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <span
        className="mb-2 block text-[10px] font-bold uppercase tracking-widest"
        style={{ color: accent, fontFamily: MONO }}
      >
        {label}
      </span>
      <span className="text-3xl font-bold italic" style={{ fontFamily: OUTFIT, color: PAPEL }}>
        {value}
      </span>
    </div>
  );
}

export default function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [heroMounted, setHeroMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full selection:bg-[#3ECF6E]/30 selection:text-white"
      style={{ backgroundColor: NEGRO, color: PAPEL, fontFamily: "'Inter', sans-serif" }}
    >
      {/* viñeta radial */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle at center, #1a1a17 0%, ${NEGRO} 70%)`,
        }}
      />
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
            <Button
              variant="outlined"
              endIcon={<ArrowOutwardIcon sx={{ fontSize: 15 }} />}
              sx={{
                borderColor: "rgba(244,239,227,0.3)",
                color: PAPEL,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { borderColor: REACTIVO, color: REACTIVO },
              }}
            >
              Solicitar demo
            </Button>
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
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: REACTIVO,
                color: NEGRO,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Solicitar demo
            </Button>
            <Button variant="text" sx={{ color: PAPEL, textTransform: "none" }}>
              Iniciar sesión
            </Button>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* HERO */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
          <Watermark label="KBCP" top="8%" />

          <div className="relative max-w-3xl">
            <h1
              className="text-[13vw] font-black uppercase italic leading-[0.95] tracking-tighter md:text-7xl"
              style={{ fontFamily: OUTFIT, color: PAPEL }}
            >
              El sabor
              <br />
              tiene <span style={{ color: NEON }}>fórmula</span>
            </h1>

            <div className="mt-10 flex justify-center">
              <PeriodicLogo />
            </div>
            <p
              className="mx-auto mt-8 mb-8 max-w-md text-sm leading-relaxed"
              style={{ color: "rgba(244,239,227,0.65)" }}
            >
              El sistema de administración para taquerías que operan con la precisión de un
              laboratorio, sin perder el fuego de lo hecho a mano.
            </p>
            <div className=" flex justify-center">
              <TacoMolecule size={380} mounted={heroMounted} />
            </div>
            {/* <div
              className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs"
              style={{ borderColor: "rgba(62,207,110,0.4)", color: REACTIVO, fontFamily: MONO }}
            >
              <span>C₁₈H₃₄O₂</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>fórmula del taco</span>
            </div> */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {/* <Button
                variant="contained"
                size="large"
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
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "rgba(244,239,227,0.3)",
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

          <div className="absolute bottom-12 flex flex-col items-center gap-3 opacity-60">
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

        {/* SECCIÓN 2 — alineada a la derecha */}
        <section className="relative flex min-h-screen items-center justify-end overflow-hidden px-8 md:px-24">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 select-none text-[30vw] font-black italic leading-none md:text-[18vw]"
            style={{ color: FUEGO, opacity: 0.07, fontFamily: OUTFIT }}
          >
            01
          </span>

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
              className="rounded-3xl border p-10"
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
                <Stat label="Merma" value="-32%" accent={REACTIVO} />
                <Stat label="Stock en vivo" value="ACTIVO" accent={NEON} />
              </div>
            </div>
          </Reveal>
        </section>

        {/* SECCIÓN 3 — alineada a la izquierda */}
        <section className="relative flex min-h-screen items-center justify-start overflow-hidden px-8 md:px-24">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 select-none text-[30vw] font-black italic leading-none md:text-[18vw]"
            style={{ color: REACTIVO, opacity: 0.06, fontFamily: OUTFIT }}
          >
            02
          </span>

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
                <Stat label="Tiempo de reacción" value="4.2 min" accent={NEON} />
                <Stat label="Consistencia" value="98%" accent={REACTIVO} />
              </div>
            </div>
          </Reveal>
        </section>

        {/* SECCIÓN 4 — resultados, alineada a la derecha */}
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
              className="rounded-3xl border p-10"
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
                <Stat label="Tickets por semana" value="1,200+" accent={FUEGO} />
                <Stat label="Pedido a mesa" value="4.2 min" accent={REACTIVO} />
              </div>
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
