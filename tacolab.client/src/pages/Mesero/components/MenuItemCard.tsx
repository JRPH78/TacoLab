import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type { MenuItem } from "../../../types/IMenu";
import { NEGRO, PAPEL, OUTFIT, MONO } from "../../../utilities/PaleteColors";

export default function MenuItemCard({
  item,
  accent,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}: {
  item: MenuItem;
  accent: string;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div
      className="flex flex-col justify-between rounded-2xl border p-4 backdrop-blur-md transition-all duration-150"
      style={{
        borderColor: quantity > 0 ? accent : "rgba(244,239,227,0.1)",
        backgroundColor: quantity > 0 ? `${accent}12` : "rgba(255,255,255,0.03)",
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
      <p className="mb-4 text-xs leading-relaxed" style={{ color: "rgba(244,239,227,0.55)" }}>
        {item.description}
      </p>

      {quantity === 0 ? (
        <button
          onClick={onAdd}
          className="rounded-full border py-2 text-xs font-bold uppercase tracking-widest transition-colors"
          style={{ borderColor: accent, color: accent, fontFamily: OUTFIT }}
        >
          Agregar
        </button>
      ) : (
        <div
          className="flex items-center justify-between rounded-full border py-1"
          style={{ borderColor: accent }}
        >
          <button
            onClick={onDecrement}
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ color: accent }}
            aria-label="Quitar uno"
          >
            <RemoveIcon fontSize="small" />
          </button>
          <span className="text-sm font-bold" style={{ fontFamily: MONO, color: PAPEL }}>
            {quantity}
          </span>
          <button
            onClick={onIncrement}
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ color: accent }}
            aria-label="Agregar uno"
          >
            <AddIcon fontSize="small" />
          </button>
        </div>
      )}
    </div>
  );
}
