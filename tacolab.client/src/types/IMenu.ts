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
  /**
   * Si existe, el producto OBLIGA a elegir carne(s) antes de poder agregarse
   * (torta, gringa, quesadilla con carne, volcán). `max` limita cuántas
   * carnes distintas se pueden marcar; `min` normalmente es 1.
   */
  meatSelection?: {
    min: number;
    max: number;
  };
}
