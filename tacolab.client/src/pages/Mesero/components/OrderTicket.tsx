import { useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { formatearNotas, type OrderLine } from "../../../types/IOrder";
import { NEGRO, PAPEL, REACTIVO, FUEGO, OUTFIT, MONO } from "../../../utilities/PaleteColors";

interface OrderTicketProps {
  mesa: string;
  lineas: OrderLine[];
  notas: string;
  enviando: boolean;
  abierto: boolean;
  onCerrar: () => void;
  /** Reciben el id de la LÍNEA, no del producto — un mismo producto puede
   * tener varias líneas con distinta personalización. */
  onIncrementar: (lineaId: string) => void;
  onDecrementar: (lineaId: string) => void;
  onQuitar: (lineaId: string) => void;
  onEditar: (linea: OrderLine) => void;
  onNotas: (texto: string) => void;
  onEnviar: () => void;
}

export default function OrderTicket({
  mesa,
  lineas,
  notas,
  enviando,
  abierto,
  onCerrar,
  onIncrementar,
  onDecrementar,
  onQuitar,
  onEditar,
  onNotas,
  onEnviar,
}: OrderTicketProps) {
  const total = useMemo(
    () => lineas.reduce((acc, l) => acc + l.item.price * l.quantity, 0),
    [lineas],
  );
  const piezas = useMemo(() => lineas.reduce((acc, l) => acc + l.quantity, 0), [lineas]);

  const contenido = (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <span
            className="block text-[10px] font-bold uppercase tracking-[0.35em]"
            style={{ color: REACTIVO, fontFamily: MONO }}
          >
            fórmula del pedido
          </span>
          <span
            className="text-lg font-black uppercase italic"
            style={{ fontFamily: OUTFIT, color: PAPEL }}
          >
            {mesa}
          </span>
        </div>
        <button
          onClick={onCerrar}
          className="rounded-full p-1.5 lg:hidden"
          style={{ color: PAPEL }}
          aria-label="Cerrar pedido"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {lineas.length === 0 ? (
          <p
            className="mt-10 text-center text-xs"
            style={{ color: "rgba(244,239,227,0.4)", fontFamily: MONO }}
          >
            todavía no hay reactivos en el pedido
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {lineas.map((l) => {
              const notasLinea = formatearNotas(l.meats, l.modifiers, l.freeNote);
              return (
                <li
                  key={l.id}
                  className="rounded-xl border p-3"
                  style={{ borderColor: "rgba(244,239,227,0.1)" }}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: OUTFIT, color: PAPEL }}
                    >
                      {l.item.name}
                    </span>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <button
                        onClick={() => onEditar(l)}
                        style={{ color: "rgba(244,239,227,0.6)" }}
                        aria-label="Editar línea"
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => onQuitar(l.id)}
                        style={{ color: FUEGO }}
                        aria-label="Quitar del pedido"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </div>
                  </div>

                  {notasLinea && (
                    <button
                      onClick={() => onEditar(l)}
                      className="mb-2 block text-left text-[11px] italic underline decoration-dotted underline-offset-2"
                      style={{ color: REACTIVO, fontFamily: MONO }}
                    >
                      {notasLinea}
                    </button>
                  )}

                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-1 rounded-full border px-2 py-0.5"
                      style={{ borderColor: "rgba(244,239,227,0.2)" }}
                    >
                      <button
                        onClick={() => onDecrementar(l.id)}
                        className="text-sm font-bold"
                        style={{ color: PAPEL }}
                        aria-label="Restar"
                      >
                        −
                      </button>
                      <span
                        className="w-4 text-center text-xs font-bold"
                        style={{ fontFamily: MONO, color: REACTIVO }}
                      >
                        {l.quantity}
                      </span>
                      <button
                        onClick={() => onIncrementar(l.id)}
                        className="text-sm font-bold"
                        style={{ color: PAPEL }}
                        aria-label="Sumar"
                      >
                        +
                      </button>
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ fontFamily: MONO, color: "rgba(244,239,227,0.7)" }}
                    >
                      ${l.item.price * l.quantity}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 border-t pt-4" style={{ borderColor: "rgba(244,239,227,0.12)" }}>
        <textarea
          value={notas}
          onChange={(e) => onNotas(e.target.value)}
          placeholder="Notas generales del pedido (para toda la mesa)"
          rows={2}
          className="mb-4 w-full resize-none rounded-lg border bg-transparent p-2.5 text-xs outline-none"
          style={{ borderColor: "rgba(244,239,227,0.15)", color: PAPEL, fontFamily: MONO }}
        />

        <div className="mb-4 flex items-center justify-between">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "rgba(244,239,227,0.5)", fontFamily: MONO }}
          >
            {piezas} {piezas === 1 ? "pieza" : "piezas"}
          </span>
          <span className="text-2xl font-black italic" style={{ fontFamily: OUTFIT, color: PAPEL }}>
            ${total}
          </span>
        </div>

        <button
          onClick={onEnviar}
          disabled={lineas.length === 0 || enviando}
          className="w-full rounded-full py-3 text-sm font-bold uppercase tracking-widest transition-opacity disabled:opacity-30"
          style={{ backgroundColor: FUEGO, color: PAPEL, fontFamily: OUTFIT }}
        >
          {enviando ? "Enviando..." : "Enviar a cocina"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="fixed right-0 top-0 z-40 hidden h-screen w-[360px] border-l p-6 backdrop-blur-xl lg:block"
        style={{ backgroundColor: "rgba(11,11,10,0.75)", borderColor: "rgba(244,239,227,0.1)" }}
      >
        {contenido}
      </aside>

      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-3xl border-t p-6 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          abierto ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ backgroundColor: NEGRO, borderColor: "rgba(244,239,227,0.12)" }}
      >
        {contenido}
      </div>
      {abierto && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onCerrar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
