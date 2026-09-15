import { useMemo, useState } from "react";
import { NEGRO, PAPEL, REACTIVO, OUTFIT, MONO } from "../../utilities/PaleteColors";
import { NotebookGrid } from "../../components/NotebookGrid";
import { Grain } from "../../components/Grain";
import { CATEGORIAS, MENU } from "../../data/menuMock";
import type { OrderLine } from "../../types/IMenu";
import TableGate from "./components/TableGate";
import CategoryRail from "./components/CategoryRail";
import MenuItemCard from "./components/MenuItemCard";
import OrderTicket from "./components/OrderTicket";

export default function Mesero() {
  const [mesa, setMesa] = useState<string | null>(null);
  const [categoriaActiva, setCategoriaActiva] = useState(CATEGORIAS[0].id);
  const [busqueda, setBusqueda] = useState("");
  const [lineas, setLineas] = useState<OrderLine[]>([]);
  const [notas, setNotas] = useState("");
  const [ticketAbierto, setTicketAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  const itemsVisibles = useMemo(() => {
    return MENU.filter((item) => {
      const coincideCategoria = item.categoryId === categoriaActiva;
      const coincideBusqueda = item.name.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && (busqueda === "" || coincideBusqueda);
    });
  }, [categoriaActiva, busqueda]);

  function agregar(itemId: string) {
    setLineas((prev) => {
      const existente = prev.find((l) => l.item.id === itemId);
      if (existente) {
        return prev.map((l) => (l.item.id === itemId ? { ...l, quantity: l.quantity + 1 } : l));
      }
      const item = MENU.find((m) => m.id === itemId);
      if (!item) return prev;
      return [...prev, { item, quantity: 1, notes: "" }];
    });
  }

  function incrementar(itemId: string) {
    setLineas((prev) =>
      prev.map((l) => (l.item.id === itemId ? { ...l, quantity: l.quantity + 1 } : l)),
    );
  }

  function decrementar(itemId: string) {
    setLineas((prev) =>
      prev
        .map((l) => (l.item.id === itemId ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0),
    );
  }

  function quitar(itemId: string) {
    setLineas((prev) => prev.filter((l) => l.item.id !== itemId));
  }

  function cantidadDe(itemId: string) {
    return lineas.find((l) => l.item.id === itemId)?.quantity ?? 0;
  }

  async function enviarPedido() {
    setEnviando(true);
    // TODO: reemplazar por POST /api/pedidos { mesa, lineas, notas } cuando el backend esté listo.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setEnviando(false);
    setConfirmado(true);
    setLineas([]);
    setNotas("");
    setTicketAbierto(false);
    setTimeout(() => setConfirmado(false), 2500);
  }

  const totalPiezas = lineas.reduce((acc, l) => acc + l.quantity, 0);
  const totalPedido = lineas.reduce((acc, l) => acc + l.item.price * l.quantity, 0);

  if (!mesa) {
    return (
      <div className="relative min-h-screen w-full" style={{ backgroundColor: NEGRO }}>
        <NotebookGrid />
        <Grain />
        <TableGate onConfirm={setMesa} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full" style={{ backgroundColor: NEGRO }}>
      <NotebookGrid />
      <Grain />

      <div className="relative z-10 px-5 pb-28 pt-6 lg:mr-[360px] lg:px-10 lg:pb-10 lg:pt-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <span
              className="block text-[10px] font-bold uppercase tracking-[0.35em]"
              style={{ color: REACTIVO, fontFamily: MONO }}
            >
              mesero · en turno
            </span>
            <h1
              className="text-3xl font-black uppercase italic tracking-tight"
              style={{ fontFamily: OUTFIT, color: PAPEL }}
            >
              {mesa}
            </h1>
          </div>
          <button
            onClick={() => setMesa(null)}
            className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest"
            style={{
              borderColor: "rgba(244,239,227,0.2)",
              color: "rgba(244,239,227,0.6)",
              fontFamily: MONO,
            }}
          >
            Cambiar mesa
          </button>
        </header>

        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar en el menú..."
          className="mb-5 w-full rounded-full border bg-transparent px-5 py-2.5 text-sm outline-none"
          style={{ borderColor: "rgba(244,239,227,0.15)", color: PAPEL, fontFamily: MONO }}
        />

        <div className="mb-6">
          <CategoryRail
            categorias={CATEGORIAS}
            activa={categoriaActiva}
            onSelect={setCategoriaActiva}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {itemsVisibles.map((item) => {
            const categoria = CATEGORIAS.find((c) => c.id === item.categoryId);
            return (
              <MenuItemCard
                key={item.id}
                item={item}
                accent={categoria?.color ?? REACTIVO}
                quantity={cantidadDe(item.id)}
                onAdd={() => agregar(item.id)}
                onIncrement={() => incrementar(item.id)}
                onDecrement={() => decrementar(item.id)}
              />
            );
          })}
          {itemsVisibles.length === 0 && (
            <p
              className="col-span-full py-10 text-center text-sm"
              style={{ color: "rgba(244,239,227,0.4)", fontFamily: MONO }}
            >
              no hay elementos que coincidan con esa búsqueda
            </p>
          )}
        </div>
      </div>

      <OrderTicket
        mesa={mesa}
        lineas={lineas}
        notas={notas}
        enviando={enviando}
        abierto={ticketAbierto}
        onCerrar={() => setTicketAbierto(false)}
        onIncrementar={incrementar}
        onDecrementar={decrementar}
        onQuitar={quitar}
        onNotas={setNotas}
        onEnviar={enviarPedido}
      />

      {totalPiezas > 0 && !ticketAbierto && (
        <button
          onClick={() => setTicketAbierto(true)}
          className="fixed inset-x-5 bottom-5 z-30 flex items-center justify-between rounded-full px-6 py-4 lg:hidden"
          style={{ backgroundColor: REACTIVO, color: NEGRO, fontFamily: OUTFIT }}
        >
          <span className="text-sm font-bold uppercase tracking-widest">
            {totalPiezas} {totalPiezas === 1 ? "pieza" : "piezas"}
          </span>
          <span className="text-lg font-black italic">${totalPedido}</span>
        </button>
      )}

      {confirmado && (
        <div
          className="fixed left-1/2 top-8 z-50 -translate-x-1/2 rounded-full border px-6 py-3 text-sm font-bold uppercase tracking-widest"
          style={{
            borderColor: REACTIVO,
            backgroundColor: "rgba(62,207,110,0.15)",
            color: REACTIVO,
            fontFamily: OUTFIT,
          }}
        >
          Pedido enviado a cocina
        </div>
      )}
    </div>
  );
}
