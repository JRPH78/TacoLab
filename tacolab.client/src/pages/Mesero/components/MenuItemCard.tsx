import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TuneIcon from "@mui/icons-material/Tune";
import type { MenuItem } from "../../../types/IMenu";
import { NEGRO, PAPEL, OUTFIT, MONO } from "../../../utilities/PaleteColors";

export default function MenuItemCard({
  item,
  accent,
  quantityPlano,
  quantityTotal,
  onAddPlano,
  onIncrementPlano,
  onDecrementPlano,
  onPersonalizar,
}: {
  item: MenuItem;
  accent: string;
  /** Cantidad de la línea "sin modificar" de este producto (no aplica si requiere carne). */
  quantityPlano: number;
  /** Suma de todas las líneas de este producto, incluidas las personalizadas. */
  quantityTotal: number;
  onAddPlano: () => void;
  onIncrementPlano: () => void;
  onDecrementPlano: () => void;
  onPersonalizar: () => void;
}) {
  const conNotas = quantityTotal - quantityPlano;
  const requiereCarne = !!item.meatSelection;

  return (
    <div
      className="flex flex-col justify-between rounded-2xl border p-4 backdrop-blur-md transition-all duration-150"
      style={{
        borderColor: quantityTotal > 0 ? accent : "rgba(244,239,227,0.1)",
        backgroundColor: quantityTotal > 0 ? `${accent}12` : "rgba(255,255,255,0.03)",
      }}
    >
      <div className="mb-4 flex items-start justify-between">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-black"
          style={{
            backgroundColor: NEGRO,
            color: accent,
            fontFamily: MONO,
            border: `1px solid ${accent}`,
          }}
        >
          {item.symbol}
        </span>
        <span className="text-sm font-bold" style={{ fontFamily: MONO, color: PAPEL }}>
          ${item.price}
        </span>
      </div>

      <h3 className="mb-1 text-base font-bold" style={{ fontFamily: OUTFIT, color: PAPEL }}>
        {item.name}
      </h3>
      <p className="mb-1 text-xs leading-relaxed" style={{ color: "rgba(244,239,227,0.55)" }}>
        {item.description}
      </p>
      {requiereCarne && (
        <p
          className="mb-3 text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: accent, fontFamily: MONO }}
        >
          elige hasta {item.meatSelection!.max} {item.meatSelection!.max > 1 ? "carnes" : "carne"}
        </p>
      )}
      {!requiereCarne && <div className="mb-3" />}

      {requiereCarne ? (
        <button
          onClick={onPersonalizar}
          className="w-full rounded-full py-2 text-xs font-bold uppercase tracking-widest transition-colors"
          style={{ backgroundColor: accent, color: NEGRO, fontFamily: OUTFIT }}
        >
          {quantityTotal > 0
            ? `Agregar otra (${quantityTotal} en pedido)`
            : "Elegir carne y agregar"}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {quantityPlano === 0 ? (
            <button
              onClick={onAddPlano}
              className="flex-1 rounded-full border py-2 text-xs font-bold uppercase tracking-widest transition-colors"
              style={{ borderColor: accent, color: accent, fontFamily: OUTFIT }}
            >
              Agregar
            </button>
          ) : (
            <div
              className="flex flex-1 items-center justify-between rounded-full border py-1 px-1"
              style={{ borderColor: accent }}
            >
              <button
                onClick={onDecrementPlano}
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ color: accent }}
                aria-label="Quitar uno"
              >
                <RemoveIcon fontSize="small" />
              </button>
              <span className="text-sm font-bold" style={{ fontFamily: MONO, color: PAPEL }}>
                {quantityPlano}
              </span>
              <button
                onClick={onIncrementPlano}
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ color: accent }}
                aria-label="Agregar uno"
              >
                <AddIcon fontSize="small" />
              </button>
            </div>
          )}

          <button
            onClick={onPersonalizar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
            style={{ borderColor: "rgba(244,239,227,0.2)", color: PAPEL }}
            title="Agregar con modificadores (ej. puro cilantro)"
            aria-label="Personalizar y agregar"
          >
            <TuneIcon fontSize="small" />
          </button>
        </div>
      )}

      {conNotas > 0 && !requiereCarne && (
        <span
          className="mt-2 block text-[10px] font-semibold"
          style={{ color: accent, fontFamily: MONO }}
        >
          +{conNotas} {conNotas === 1 ? "personalizado" : "personalizados"} · {quantityTotal} en
          total
        </span>
      )}
    </div>
  );
}
