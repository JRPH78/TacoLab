import type { MenuItem } from "./IMenu";

export interface OrderLine {
  /** Identificador único de la línea, NO del producto — el mismo producto
   * puede tener varias líneas si se pidió con distintas personalizaciones. */
  id: string;
  item: MenuItem;
  quantity: number;
  /** Carnes elegidas (torta, gringa, quesadilla con carne, volcán). Vacío si no aplica. */
  meats: string[];
  /** Modificadores rápidos elegidos (sin cebolla, extra salsa, etc.). */
  modifiers: string[];
  /** Nota libre adicional, escrita a mano por el mesero. */
  freeNote: string;
}

export const MODIFICADORES_RAPIDOS = [
  "cilantro y cebolla",
  "puro cilantro",
  "puro cebolla",
  "Sin Verdura",
] as const;

/** Texto legible para mostrar en el ticket, ej: "Carnes: Asada, Chorizo · sin cebolla". */
export function formatearNotas(meats: string[], modifiers: string[], freeNote: string): string {
  const carnesTexto = meats.length ? `Carnes: ${meats.join(", ")}` : "";
  return [carnesTexto, ...modifiers, freeNote.trim()].filter(Boolean).join(" · ");
}

/** Compara si una línea ya tiene exactamente la misma personalización que la
 * que se está por agregar, para poder sumarle cantidad en vez de duplicarla. */
export function mismaPersonalizacion(
  linea: OrderLine,
  candidato: { meats: string[]; modifiers: string[]; freeNote: string },
): boolean {
  const mismasCarnes =
    linea.meats.length === candidato.meats.length &&
    linea.meats.every((m) => candidato.meats.includes(m));
  const mismosModificadores =
    linea.modifiers.length === candidato.modifiers.length &&
    linea.modifiers.every((m) => candidato.modifiers.includes(m));
  return mismasCarnes && mismosModificadores && linea.freeNote.trim() === candidato.freeNote.trim();
}

/** Sesión activa del modal de personalización: o se está agregando un producto
 * nuevo, o se está editando una línea que ya existe en el pedido. */
export type SesionPersonalizacion =
  | { modo: "agregar"; item: MenuItem }
  | {
      modo: "editar";
      item: MenuItem;
      lineaId: string;
      cantidad: number;
      meats: string[];
      modifiers: string[];
      freeNote: string;
    }
  | null;
