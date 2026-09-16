import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { MODIFICADORES_RAPIDOS, type SesionPersonalizacion } from "../../../types/IOrder";
import { CARNES_DISPONIBLES } from "../../../data/proteinas";
import { NEGRO, PAPEL, OUTFIT, MONO, FUEGO } from "../../../utilities/PaleteColors";

interface ItemCustomizeSheetProps {
  sesion: SesionPersonalizacion;
  accent: string;
  onClose: () => void;
  onAgregar: (
    itemId: string,
    cantidad: number,
    meats: string[],
    modifiers: string[],
    freeNote: string,
  ) => void;
  onGuardarEdicion: (
    lineaId: string,
    cantidad: number,
    meats: string[],
    modifiers: string[],
    freeNote: string,
  ) => void;
  onEliminarLinea: (lineaId: string) => void;
}

/** Modal único para armar o editar líneas de pedido. En modo "agregar" cada vez
 * que se confirma nace un plato nuevo en el ticket y el selector se limpia,
 * quedando listo para armar otro plato del mismo producto sin cerrar el modal
 * (ej: "4 asada sin nada" y "5 asada sin nada" quedan como dos líneas separadas).
 * En modo "editar" se sobreescribe la línea que ya estaba en el ticket y el
 * modal se cierra al guardar. */
export default function ItemCustomizeSheet({
  sesion,
  accent,
  onClose,
  onAgregar,
  onGuardarEdicion,
  onEliminarLinea,
}: ItemCustomizeSheetProps) {
  const [cantidad, setCantidad] = useState(1);
  const [carnesElegidas, setCarnesElegidas] = useState<string[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [notaLibre, setNotaLibre] = useState("");
  const [rondaCount, setRondaCount] = useState(0); // piezas agregadas en esta apertura del modal

  // Clave estable por "apertura" del modal: distingue agregar producto X de
  // editar línea Y, incluso si comparten el mismo producto.
  const claveApertura = sesion
    ? sesion.modo === "editar"
      ? `editar-${sesion.lineaId}`
      : `agregar-${sesion.item.id}`
    : null;

  useEffect(() => {
    if (!sesion) return;
    if (sesion.modo === "editar") {
      setCantidad(sesion.cantidad);
      setCarnesElegidas(sesion.meats);
      setSeleccionados(sesion.modifiers);
      setNotaLibre(sesion.freeNote);
    } else {
      setCantidad(1);
      setCarnesElegidas([]);
      setSeleccionados([]);
      setNotaLibre("");
    }
    setRondaCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveApertura]);

  if (!sesion) return null;

  const item = sesion.item;
  const esEdicion = sesion.modo === "editar";
  const meatSelection = item.meatSelection;
  const maxCarnes = meatSelection?.max ?? 0;
  const minCarnes = meatSelection?.min ?? 0;
  const faltanCarnes = meatSelection ? Math.max(0, minCarnes - carnesElegidas.length) : 0;

  function alternarCarne(carne: string) {
    setCarnesElegidas((prev) => {
      if (prev.includes(carne)) return prev.filter((c) => c !== carne);
      if (prev.length >= maxCarnes) return prev;
      return [...prev, carne];
    });
  }

  function alternarModificador(mod: string) {
    setSeleccionados((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod],
    );
  }

  function confirmar() {
    if (faltanCarnes > 0 || !sesion) return;
    const nota = notaLibre.trim();

    if (sesion.modo === "editar") {
      onGuardarEdicion(sesion.lineaId, cantidad, carnesElegidas, seleccionados, nota);
      return; // el padre cierra el modal
    }

    onAgregar(sesion.item.id, cantidad, carnesElegidas, seleccionados, nota);
    setRondaCount((n) => n + cantidad);

    // limpia el selector para armar el próximo plato, SIN cerrar el modal
    setCantidad(1);
    setCarnesElegidas([]);
    setSeleccionados([]);
    setNotaLibre("");
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-5"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl border p-6 backdrop-blur-xl"
        style={{ backgroundColor: "rgba(11,11,10,0.92)", borderColor: "rgba(244,239,227,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <span
              className="block text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: accent, fontFamily: MONO }}
            >
              {esEdicion ? "editar línea" : "personalizar"}
            </span>
            <h3 className="text-lg font-black" style={{ fontFamily: OUTFIT, color: PAPEL }}>
              {item.name}
            </h3>
          </div>
          <button onClick={onClose} style={{ color: PAPEL }} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>

        {meatSelection && (
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: PAPEL, fontFamily: MONO }}
              >
                elige tu{maxCarnes > 1 ? "s" : ""} carne{maxCarnes > 1 ? "s" : ""}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: faltanCarnes > 0 ? FUEGO : accent, fontFamily: MONO }}
              >
                {carnesElegidas.length}/{maxCarnes}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CARNES_DISPONIBLES.map((carne) => {
                const activa = carnesElegidas.includes(carne);
                const bloqueada = !activa && carnesElegidas.length >= maxCarnes;
                return (
                  <button
                    key={carne}
                    onClick={() => alternarCarne(carne)}
                    disabled={bloqueada}
                    className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-30"
                    style={{
                      borderColor: activa ? accent : "rgba(244,239,227,0.18)",
                      backgroundColor: activa ? `${accent}1A` : "transparent",
                      color: activa ? accent : "rgba(244,239,227,0.75)",
                      fontFamily: OUTFIT,
                    }}
                  >
                    {carne}
                  </button>
                );
              })}
            </div>
            {faltanCarnes > 0 && (
              <span className="mt-2 block text-[11px]" style={{ color: FUEGO, fontFamily: MONO }}>
                falta elegir {faltanCarnes === 1 ? "1 carne" : `${faltanCarnes} carnes`}
              </span>
            )}
          </div>
        )}

        <span
          className="mb-2 block text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "rgba(244,239,227,0.5)", fontFamily: MONO }}
        >
          modificadores rápidos (opcional)
        </span>
        <div className="mb-4 flex flex-wrap gap-2">
          {MODIFICADORES_RAPIDOS.map((mod) => {
            const activo = seleccionados.includes(mod);
            return (
              <button
                key={mod}
                onClick={() => alternarModificador(mod)}
                className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderColor: activo ? accent : "rgba(244,239,227,0.18)",
                  backgroundColor: activo ? `${accent}1A` : "transparent",
                  color: activo ? accent : "rgba(244,239,227,0.7)",
                  fontFamily: MONO,
                }}
              >
                {mod}
              </button>
            );
          })}
        </div>

        <textarea
          value={notaLibre}
          onChange={(e) => setNotaLibre(e.target.value)}
          placeholder="Otra indicación (opcional)"
          rows={2}
          className="mb-5 w-full resize-none rounded-lg border bg-transparent p-2.5 text-xs outline-none"
          style={{ borderColor: "rgba(244,239,227,0.15)", color: PAPEL, fontFamily: MONO }}
        />

        <div className="mb-5 flex items-center justify-between">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "rgba(244,239,227,0.5)", fontFamily: MONO }}
          >
            cantidad
          </span>
          <div
            className="flex items-center gap-4 rounded-full border px-3 py-1.5"
            style={{ borderColor: accent }}
          >
            <button
              onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              style={{ color: accent }}
              aria-label="Restar"
            >
              −
            </button>
            <span
              className="w-4 text-center text-sm font-bold"
              style={{ fontFamily: MONO, color: PAPEL }}
            >
              {cantidad}
            </span>
            <button
              onClick={() => setCantidad((c) => c + 1)}
              style={{ color: accent }}
              aria-label="Sumar"
            >
              +
            </button>
          </div>
        </div>

        {!esEdicion && rondaCount > 0 && (
          <span
            className="mb-3 block text-center text-[11px] font-semibold"
            style={{ color: accent, fontFamily: MONO }}
          >
            ✓ {rondaCount} {rondaCount === 1 ? "pieza agregada" : "piezas agregadas"} · seguí
            eligiendo o cerrá
          </span>
        )}

        <button
          onClick={confirmar}
          disabled={faltanCarnes > 0}
          className="w-full rounded-full py-3 text-sm font-bold uppercase tracking-widest transition-opacity disabled:opacity-30"
          style={{ backgroundColor: accent, color: NEGRO, fontFamily: OUTFIT }}
        >
          {faltanCarnes > 0
            ? "Elige la carne para continuar"
            : esEdicion
              ? "Guardar cambios"
              : `Agregar ${cantidad} al pedido`}
        </button>

        {esEdicion && (
          <button
            onClick={() => onEliminarLinea(sesion.lineaId)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: FUEGO, fontFamily: MONO }}
          >
            <DeleteOutlineIcon fontSize="small" />
            Quitar esta línea del pedido
          </button>
        )}
      </div>
    </div>
  );
}
