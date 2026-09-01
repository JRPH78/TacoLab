import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const NEGRO = "#0B0B0A";
const PAPEL = "#F4EFE3";
const REACTIVO = "#3ECF6E";
const FUEGO = "#E8481C";
const NEON = "#F5B700";
const OUTFIT = "'Outfit', sans-serif";
const MONO = "'IBM Plex Mono', monospace";

/* ---------- utilidades ---------- */

function useReveal() {
  const ref = useRef(null);
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

function Reveal({ children, className = "" }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-14"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- fondo: cuadrícula de plano de laboratorio ---------- */

function BlueprintGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(62,207,110,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(62,207,110,0.06) 1px, transparent 1px),
          radial-gradient(circle at 50% 30%, #1a1a17 0%, ${NEGRO} 65%)
        `,
        backgroundSize: "42px 42px, 42px 42px, 100% 100%",
      }}
    />
  );
}

function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.05]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, transparent 1px, transparent 2px)",
      }}
    />
  );
}

function CornerFrame() {
  const base = "absolute w-14 h-14 border-current";
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{ color: "rgba(62,207,110,0.22)" }}
    >
      <div className={`${base} top-6 left-6 border-t-2 border-l-2`} />
      <div className={`${base} top-6 right-6 border-t-2 border-r-2`} />
      <div className={`${base} bottom-6 left-6 border-b-2 border-l-2`} />
      <div className={`${base} bottom-6 right-6 border-b-2 border-r-2`} />
    </div>
  );
}

/* ---------- la molécula del taco: elemento de firma ---------- */

const ATOMS = [
  { id: "to", symbol: "TO", name: "tortilla", x: 120, y: 200, color: PAPEL },
  { id: "ca", symbol: "CA", name: "carne", x: 185, y: 87, color: FUEGO },
  { id: "ce", symbol: "CE", name: "cebolla", x: 315, y: 87, color: PAPEL },
  { id: "ci", symbol: "CI", name: "cilantro", x: 380, y: 200, color: REACTIVO },
  { id: "sa", symbol: "SA", name: "salsa", x: 315, y: 313, color: FUEGO },
  { id: "li", symbol: "LI", name: "limón", x: 185, y: 313, color: NEON },
];
const CENTER = { x: 250, y: 200 };
const RING_ORDER = ["to", "ca", "ce", "ci", "sa", "li"];

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function TacoMolecule({ size = 420, mounted = true, interactive = true, highlight = null }) {
  const [hovered, setHovered] = useState(highlight);
  const atomById = Object.fromEntries(ATOMS.map((a) => [a.id, a]));
  const active = hovered ? atomById[hovered] : null;

  const ringBonds = RING_ORDER.map((id, i) => {
    const a = atomById[id];
    const b = atomById[RING_ORDER[(i + 1) % RING_ORDER.length]];
    return { from: a, to: b, key: `ring-${id}` };
  });
  const spokeBonds = ATOMS.map((a) => ({ from: CENTER, to: a, key: `spoke-${a.id}` }));

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 500 400"
        style={{ width: size, height: (size * 400) / 500 }}
        className="overflow-visible"
      >
        {spokeBonds.map((b, i) => {
          const len = dist(b.from, b.to);
          return (
            <line
              key={b.key}
              x1={b.from.x}
              y1={b.from.y}
              x2={b.to.x}
              y2={b.to.y}
              stroke={REACTIVO}
              strokeWidth="1.5"
              strokeOpacity="0.35"
              strokeDasharray={len}
              strokeDashoffset={mounted ? 0 : len}
              style={{ transition: `stroke-dashoffset 900ms ease-out ${200 + i * 90}ms` }}
            />
          );
        })}
        {ringBonds.map((b, i) => {
          const len = dist(b.from, b.to);
          return (
            <line
              key={b.key}
              x1={b.from.x}
              y1={b.from.y}
              x2={b.to.x}
              y2={b.to.y}
              stroke={PAPEL}
              strokeWidth="1.5"
              strokeOpacity="0.18"
              strokeDasharray={len}
              strokeDashoffset={mounted ? 0 : len}
              style={{ transition: `stroke-dashoffset 900ms ease-out ${500 + i * 90}ms` }}
            />
          );
        })}

        {ATOMS.map((atom, i) => (
          <g
            key={atom.id}
            onMouseEnter={() => interactive && setHovered(atom.id)}
            onMouseLeave={() => interactive && setHovered(highlight)}
            className={interactive ? "cursor-pointer" : ""}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "scale(1)" : "scale(0.4)",
              transformOrigin: `${atom.x}px ${atom.y}px`,
              transition: `opacity 500ms ease-out ${300 + i * 110}ms, transform 500ms ease-out ${300 + i * 110}ms`,
            }}
          >
            <circle
              cx={atom.x}
              cy={atom.y}
              r={hovered === atom.id ? 26 : 22}
              fill={NEGRO}
              stroke={atom.color}
              strokeWidth={hovered === atom.id ? 2.5 : 1.5}
              style={{ transition: "r 200ms ease-out, stroke-width 200ms ease-out" }}
              className="motion-safe:animate-pulse"
            />
            <text
              x={atom.x}
              y={atom.y + 5}
              textAnchor="middle"
              fontFamily={OUTFIT}
              fontWeight="800"
              fontSize="15"
              fill={atom.color}
            >
              {atom.symbol}
            </text>
          </g>
        ))}

        <g
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 500ms ease-out 150ms",
          }}
        >
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r="40"
            fill={REACTIVO}
            fillOpacity="0.12"
            stroke={REACTIVO}
            strokeWidth="2"
          />
          <text
            x={CENTER.x}
            y={CENTER.y + 4}
            textAnchor="middle"
            fontFamily={MONO}
            fontWeight="700"
            fontSize="11"
            letterSpacing="1"
            fill={REACTIVO}
          >
            SABOR
          </text>
        </g>
      </svg>

      <div className="mt-4 h-5 text-center" style={{ fontFamily: MONO }}>
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: active ? active.color : "rgba(244,239,227,0.4)" }}
        >
          {active ? active.name : "pasa el cursor sobre un átomo"}
        </span>
      </div>
    </div>
  );
}

function MoleculeMark({ size = 30 }) {
  return (
    <svg viewBox="0 0 60 30" style={{ width: size * 2, height: size }}>
      <line
        x1="14"
        y1="15"
        x2="46"
        y2="15"
        stroke={REACTIVO}
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />
      <circle cx="14" cy="15" r="10" fill={NEGRO} stroke={REACTIVO} strokeWidth="2" />
      <text
        x="14"
        y="19"
        textAnchor="middle"
        fontFamily={OUTFIT}
        fontWeight="800"
        fontSize="9"
        fill={REACTIVO}
      >
        T
      </text>
      <circle cx="46" cy="15" r="10" fill={NEGRO} stroke={NEON} strokeWidth="2" />
      <text
        x="46"
        y="19"
        textAnchor="middle"
        fontFamily={OUTFIT}
        fontWeight="800"
        fontSize="9"
        fill={NEON}
      >
        L
      </text>
    </svg>
  );
}

/* ---------- protocolo: línea de tiempo real (sí es secuencial) ---------- */

const PASOS = [
  {
    n: "01",
    title: "Pedido",
    desc: "Se captura en el momento, sin papel.",
    icon: ReceiptLongIcon,
    color: NEON,
  },
  {
    n: "02",
    title: "Cocina",
    desc: "La comanda llega a la parrilla al instante.",
    icon: WhatshotIcon,
    color: FUEGO,
  },
  {
    n: "03",
    title: "Control de calidad",
    desc: "Cada plato se verifica antes de salir.",
    icon: FactCheckIcon,
    color: REACTIVO,
  },
  {
    n: "04",
    title: "Cierre",
    desc: "El corte se arma solo, en tiempo real.",
    icon: DoneAllIcon,
    color: PAPEL,
  },
];

function ProtocolTimeline() {
  return (
    <div className="relative">
      <div
        className="absolute left-0 right-0 top-9 hidden h-px md:block"
        style={{ backgroundColor: "rgba(244,239,227,0.15)" }}
      />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        {PASOS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.n} className="relative flex flex-col items-start">
              <div
                className="relative z-10 mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 bg-[#0B0B0A]"
                style={{ borderColor: p.color }}
              >
                <Icon style={{ color: p.color, fontSize: 28 }} />
              </div>
              <span
                className="text-[11px] font-bold tracking-widest"
                style={{ color: p.color, fontFamily: MONO }}
              >
                {p.n}
              </span>
              <h4
                className="mt-1 text-xl font-black uppercase italic"
                style={{ fontFamily: OUTFIT, color: PAPEL }}
              >
                {p.title}
              </h4>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "rgba(244,239,227,0.6)" }}
              >
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- página ---------- */

export default function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full selection:bg-[#3ECF6E]/30 selection:text-white"
      style={{ backgroundColor: NEGRO, color: PAPEL, fontFamily: "'Inter', sans-serif" }}
    >
      <BlueprintGrid />
      <Grain />
      <CornerFrame />

      <header
        className="fixed top-0 z-50 w-full"
        style={{ backgroundColor: "rgba(11,11,10,0.7)", backdropFilter: "blur(6px)" }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <MoleculeMark size={16} />
            <span
              className="text-sm font-black uppercase italic tracking-widest"
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
        {/* HERO — la molécula es el argumento */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center">
          <h1
            className="max-w-3xl text-[12vw] font-black uppercase italic leading-[0.95] tracking-tighter md:text-6xl"
            style={{ fontFamily: OUTFIT, color: PAPEL }}
          >
            El sabor
            <br />
            tiene <span style={{ color: NEON }}>fórmula</span>
          </h1>

          <div className="my-8">
            <TacoMolecule size={380} mounted={heroMounted} />
          </div>

          <p
            className="mx-auto mb-8 max-w-md text-sm leading-relaxed"
            style={{ color: "rgba(244,239,227,0.65)" }}
          >
            El sistema de administración para taquerías que operan con la precisión de un
            laboratorio, sin perder el fuego de lo hecho a mano.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
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
            </Button>
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
        </section>

        {/* SECCIÓN 1 — asimétrica: texto + molécula con un átomo resaltado */}
        <section className="relative flex min-h-screen items-center overflow-hidden px-8 md:px-24">
          <div className="grid w-full items-center gap-16 md:grid-cols-2">
            <Reveal>
              <h2
                className="mb-6 text-5xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-6xl"
                style={{ fontFamily: OUTFIT, color: PAPEL }}
              >
                Ingredientes
                <br />
                activos
              </h2>
              <p
                className="mb-10 max-w-md text-sm leading-relaxed"
                style={{ color: "rgba(244,239,227,0.7)" }}
              >
                Cada turno arranca con inventario controlado: sabes qué entra, qué se consume y qué
                falta antes de que falte, con la misma exactitud con la que se mide un reactivo.
              </p>
              <div className="flex gap-10">
                <div>
                  <span
                    className="mb-2 block text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: REACTIVO, fontFamily: MONO }}
                  >
                    Merma
                  </span>
                  <span className="text-3xl font-bold italic" style={{ fontFamily: OUTFIT }}>
                    -32%
                  </span>
                </div>
                <div>
                  <span
                    className="mb-2 block text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: NEON, fontFamily: MONO }}
                  >
                    Stock en vivo
                  </span>
                  <span className="text-3xl font-bold italic" style={{ fontFamily: OUTFIT }}>
                    ACTIVO
                  </span>
                </div>
              </div>
            </Reveal>
            <Reveal className="flex justify-center">
              <TacoMolecule size={320} highlight="ci" interactive={false} />
            </Reveal>
          </div>
        </section>

        {/* SECCIÓN 2 — protocolo como línea de tiempo real */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 md:px-24">
          <Reveal className="w-full max-w-5xl">
            <h2
              className="mb-4 text-center text-5xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-6xl"
              style={{ fontFamily: OUTFIT, color: PAPEL }}
            >
              El protocolo de servicio
            </h2>
            <p
              className="mx-auto mb-16 max-w-lg text-center text-sm leading-relaxed"
              style={{ color: "rgba(244,239,227,0.6)" }}
            >
              Cuatro pasos cronometrados para que cada mesa reciba el mismo resultado, sin importar
              quién esté en turno.
            </p>
            <ProtocolTimeline />
          </Reveal>
        </section>

        {/* SECCIÓN 3 — número gigante, sin caja */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
          <Reveal>
            <span
              className="mb-4 block text-xs font-bold uppercase tracking-[0.4em]"
              style={{ color: FUEGO, fontFamily: MONO }}
            >
              Datos, no corazonadas
            </span>
            <span
              className="block text-[22vw] font-black italic leading-none tracking-tighter md:text-[13rem]"
              style={{ fontFamily: OUTFIT, color: PAPEL }}
            >
              1,200<span style={{ color: NEON }}>+</span>
            </span>
            <span
              className="mt-2 block text-sm uppercase tracking-widest"
              style={{ color: "rgba(244,239,227,0.55)", fontFamily: MONO }}
            >
              tickets servidos por semana
            </span>

            <div className="mt-14 flex justify-center gap-16">
              <div>
                <span
                  className="mb-2 block text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: REACTIVO, fontFamily: MONO }}
                >
                  Pedido a mesa
                </span>
                <span className="text-3xl font-bold italic" style={{ fontFamily: OUTFIT }}>
                  4.2 min
                </span>
              </div>
              <div>
                <span
                  className="mb-2 block text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: NEON, fontFamily: MONO }}
                >
                  Consistencia
                </span>
                <span className="text-3xl font-bold italic" style={{ fontFamily: OUTFIT }}>
                  98%
                </span>
              </div>
            </div>

            <div className="mt-14 flex justify-center">
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

        {/* CIERRE */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
          <Reveal className="flex flex-col items-center">
            <TacoMolecule size={200} interactive={false} />
            <h3
              className="mt-4 text-3xl font-black uppercase italic tracking-widest md:text-5xl"
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
        className="pointer-events-none fixed bottom-8 right-10 z-50 select-none italic"
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
