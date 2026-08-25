import type { ICartItem } from './interfaces';

const DISCOUNT_CODES: Record<string, number> = {
  'PIJACA10': 0.10,
  'SEZONA15': 0.15,
};

export class Cart {
  items: ICartItem[];
  discountCode: string | null;
  discountRate: number;

  constructor(items: ICartItem[] = [], discountCode: string | null = null) {
    this.items = items;
    this.discountCode = discountCode;
    this.discountRate = discountCode ? (DISCOUNT_CODES[discountCode] ?? 0) : 0;
  }

  addItem(productId: number, quantity = 1): void {
    const existing = this.items.find((i) => i.productId === productId);
    if (existing) existing.quantity += quantity;
    else this.items.push({ productId, quantity });
  }

  removeItem(productId: number): void {
    this.items = this.items.filter((i) => i.productId !== productId);
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.items.find((i) => i.productId === productId);
    if (!item) return;
    if (quantity <= 0) this.removeItem(productId);
    else item.quantity = quantity;
  }

  getItemCount(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  getSubtotal(priceOf: (id: number) => number): number {
    return this.items.reduce((sum, i) => sum + priceOf(i.productId) * i.quantity, 0);
  }

  getDiscountedTotal(priceOf: (id: number) => number): number {
    return Math.round(this.getSubtotal(priceOf) * (1 - this.discountRate));
  }

  getDiscountAmount(priceOf: (id: number) => number): number {
    return this.getSubtotal(priceOf) - this.getDiscountedTotal(priceOf);
  }

  applyDiscount(code: string): boolean {
    const codeUp = code.trim().toUpperCase();
    if (DISCOUNT_CODES[codeUp]) {
      this.discountCode = codeUp;
      this.discountRate = DISCOUNT_CODES[codeUp];
      return true;
    }
    return false;
  }

  clearDiscount(): void {
    this.discountCode = null;
    this.discountRate = 0;
  }

  clear(): void {
    this.items = [];
    this.clearDiscount();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  toStorage(): string {
    return JSON.stringify({ items: this.items, discountCode: this.discountCode });
  }

  static fromStorage(json: string | null): Cart {
    if (!json) return new Cart();
    try {
      const parsed = JSON.parse(json);
      return new Cart(parsed.items ?? [], parsed.discountCode ?? null);
    } catch {
      return new Cart();
    }
  }

  static validCodes(): string[] {
    return Object.keys(DISCOUNT_CODES);
  }
}
