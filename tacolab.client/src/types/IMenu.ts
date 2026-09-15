export interface Category {
  id: string;
  name: string;
  /** Abreviatura estilo tabla periódica, 2 letras. */
  symbol: string;
  color: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  /** Abreviatura estilo tabla periódica, 2 letras. */
  symbol: string;
  name: string;
  description: string;
  price: number;
}

export interface OrderLine {
  item: MenuItem;
  quantity: number;
  notes: string;
}
