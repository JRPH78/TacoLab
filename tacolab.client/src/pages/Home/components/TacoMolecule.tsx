import { useState } from "react";

const NEGRO = "#0B0B0A";
const PAPEL = "#F4EFE3";
const REACTIVO = "#3ECF6E";
const FUEGO = "#E8481C";
const NEON = "#F5B700";
const OUTFIT = "'Outfit', sans-serif";
const MONO = "'IBM Plex Mono', monospace";

const ATOMS = [
  { id: "to", num: "01", symbol: "TO", name: "tortilla", x: 120, y: 200, color: PAPEL },
  { id: "ca", num: "02", symbol: "CA", name: "carne", x: 185, y: 87, color: FUEGO },
  { id: "ce", num: "03", symbol: "CE", name: "cebolla", x: 315, y: 87, color: PAPEL },
  { id: "ci", num: "04", symbol: "CI", name: "cilantro", x: 380, y: 200, color: REACTIVO },
  { id: "sa", num: "05", symbol: "SA", name: "salsa", x: 315, y: 313, color: FUEGO },
  { id: "li", num: "06", symbol: "LI", name: "limón", x: 185, y: 313, color: NEON },
];
const CENTER = { x: 250, y: 200 };
const RING_ORDER = ["to", "ca", "ce", "ci", "sa", "li"];

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

interface TacoMoleculeProps {
  size?: number;
  mounted?: boolean;
  interactive?: boolean;
  highlight?: string | null;
  /** Modo ambiental: ocupa el fondo del hero, gira sola, no muestra etiqueta. */
  ambient?: boolean;
  /** 0 → formación estable. 1 → átomos dispersos, casi disueltos (controlado por scroll). */
  reactProgress?: number;
}

export default function TacoMolecule({
  size = 420,
  mounted = true,
  interactive = true,
  highlight = null,
  ambient = false,
  reactProgress = 0,
}: TacoMoleculeProps) {
  const [hovered, setHovered] = useState<string | null>(highlight);
  const atomById = Object.fromEntries(ATOMS.map((a) => [a.id, a]));
  const active = hovered ? atomById[hovered] : null;

  // Desplaza cada átomo hacia afuera de su vector al centro, según el progreso de reacción.
  const displaced = ATOMS.map((a) => {
    const ux = (a.x - CENTER.x) / dist(a, CENTER);
    const uy = (a.y - CENTER.y) / dist(a, CENTER);
    const push = 90 * reactProgress;
    return { ...a, x: a.x + ux * push, y: a.y + uy * push };
  });
  const displacedById = Object.fromEntries(displaced.map((a) => [a.id, a]));

  const ringBonds = RING_ORDER.map((id, i) => {
    const from = displacedById[id];
    const to = displacedById[RING_ORDER[(i + 1) % RING_ORDER.length]];
    return { from, to, key: `ring-${id}` };
  });
  const spokeBonds = displaced.map((a) => ({ from: CENTER, to: a, key: `spoke-${a.id}` }));

  // En modo ambiental baja mucho la intensidad: es atmósfera, no protagonista.
  const AMBIENT_BASE = 0.32;
  const groupOpacity = ambient ? Math.max(0.05, AMBIENT_BASE - reactProgress * 0.3) : 1;
  const bondOpacityScale = ambient ? 0.5 - reactProgress * 0.3 : 1 - reactProgress * 0.7;

  const svg = (
    <svg
      viewBox="0 0 500 400"
      style={{
        width: ambient ? "100%" : size,
        height: ambient ? "100%" : (size * 400) / 500,
        opacity: groupOpacity,
        filter: ambient ? "blur(0.5px)" : "none",
        transition: "opacity 200ms linear",
      }}
      className={`overflow-visible ${ambient ? "animate-[spin_70s_linear_infinite]" : ""}`}
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
            strokeOpacity={0.35 * bondOpacityScale}
            strokeDasharray={len}
            strokeDashoffset={mounted ? 0 : len}
            style={{
              transition: `stroke-dashoffset 900ms ease-out ${200 + i * 90}ms, x1 300ms ease-out, y1 300ms ease-out, x2 300ms ease-out, y2 300ms ease-out`,
            }}
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
            strokeOpacity={0.18 * bondOpacityScale}
            strokeDasharray={len}
            strokeDashoffset={mounted ? 0 : len}
            style={{
              transition: `stroke-dashoffset 900ms ease-out ${500 + i * 90}ms, x1 300ms ease-out, y1 300ms ease-out, x2 300ms ease-out, y2 300ms ease-out`,
            }}
          />
        );
      })}

      {displaced.map((atom, i) => (
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
            style={{
              transition:
                "r 200ms ease-out, stroke-width 200ms ease-out, cx 300ms ease-out, cy 300ms ease-out",
            }}
            className={ambient ? "" : "motion-safe:animate-pulse"}
          />
          <text
            x={atom.x}
            y={atom.y + 5}
            textAnchor="middle"
            fontFamily={OUTFIT}
            fontWeight="800"
            fontSize="15"
            fill={atom.color}
            style={{ transition: "x 300ms ease-out, y 300ms ease-out" }}
          >
            {atom.symbol}
          </text>
        </g>
      ))}

      <g
        style={{
          opacity: mounted ? Math.max(0, 1 - reactProgress * 1.4) : 0,
          transition: "opacity 400ms ease-out 150ms",
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
  );

  if (ambient) {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {svg}
      </div>
    );
  }

  return (
    <div className="z-70 flex flex-col items-center">
      {svg}
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
