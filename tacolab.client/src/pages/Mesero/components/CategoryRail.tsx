import type { Category } from "../../../types/IMenu";
import { PAPEL, MONO, OUTFIT } from "../../../utilities/PaleteColors";

export default function CategoryRail({
  categorias,
  activa,
  onSelect,
}: {
  categorias: Category[];
  activa: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categorias.map((cat) => {
        const isActive = cat.id === activa;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 transition-all duration-150"
            style={{
              borderColor: isActive ? cat.color : "rgba(244,239,227,0.15)",
              backgroundColor: isActive ? `${cat.color}1A` : "transparent",
            }}
          >
            <span className="text-[10px] font-black" style={{ fontFamily: MONO, color: cat.color }}>
              {cat.symbol}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ fontFamily: OUTFIT, color: isActive ? PAPEL : "rgba(244,239,227,0.55)" }}
            >
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
