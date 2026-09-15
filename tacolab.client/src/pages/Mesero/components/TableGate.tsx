import { useState } from "react";
import { NEGRO, PAPEL, REACTIVO, OUTFIT, MONO } from "../../../utilities/PaleteColors";

const MESAS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function TableGate({ onConfirm }: { onConfirm: (mesa: string) => void }) {
  const [seleccion, setSeleccion] = useState<string | null>(null);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      <span
        className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]"
        style={{ color: REACTIVO, fontFamily: MONO }}
      >
        antes de empezar
      </span>
      <h1
        className="mb-10 text-center text-4xl font-black uppercase italic tracking-tighter md:text-5xl"
        style={{ fontFamily: OUTFIT, color: PAPEL }}
      >
        ¿Qué mesa vas a atender?
      </h1>

      <div className="mb-10 grid grid-cols-4 gap-3 sm:grid-cols-6">
        {MESAS.map((n) => {
          const id = `mesa-${n}`;
          const activa = seleccion === id;
          return (
            <button
              key={id}
              onClick={() => setSeleccion(id)}
              className="flex h-16 w-16 items-center justify-center rounded-xl border text-xl font-bold transition-all duration-150"
              style={{
                fontFamily: OUTFIT,
                borderColor: activa ? REACTIVO : "rgba(244,239,227,0.15)",
                backgroundColor: activa ? "rgba(62,207,110,0.12)" : "rgba(255,255,255,0.03)",
                color: activa ? REACTIVO : PAPEL,
                transform: activa ? "scale(1.06)" : "none",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setSeleccion("para-llevar")}
        className="mb-10 rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-widest transition-colors"
        style={{
          fontFamily: MONO,
          borderColor: seleccion === "para-llevar" ? REACTIVO : "rgba(244,239,227,0.2)",
          color: seleccion === "para-llevar" ? REACTIVO : "rgba(244,239,227,0.6)",
        }}
      >
        Para llevar
      </button>

      <button
        disabled={!seleccion}
        onClick={() =>
          seleccion &&
          onConfirm(
            seleccion === "para-llevar" ? "Para llevar" : seleccion.replace("mesa-", "Mesa "),
          )
        }
        className="rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest transition-opacity disabled:opacity-30"
        style={{ fontFamily: OUTFIT, backgroundColor: REACTIVO, color: NEGRO }}
      >
        Empezar pedido
      </button>
    </div>
  );
}
