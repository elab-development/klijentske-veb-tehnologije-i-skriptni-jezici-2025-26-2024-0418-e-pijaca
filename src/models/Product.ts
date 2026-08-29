import type { IProduct, ICartItem, Category } from './interfaces';

const RSD = new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 0 });

export class Product implements IProduct {
  id!: number;
  name!: string;
  category!: Category;
  price!: number;
  discount?: number;
  unit!: string;
  producerId!: number;
  rating!: number;
  ratingCount!: number;
  soldCount!: number;
  image!: string;
  description!: string;
  inStock!: boolean;
  certificate?: string;
  sorta?: string;
  pakovanje?: string;
  berba?: string;
  rok?: string;
  ratingBreakdown?: number[];

  constructor(data: IProduct) {
    Object.assign(this, data);
  }

  /** "1.250 RSD" */
  formatPrice(value?: number): string {
    return `${RSD.format(value ?? this.price)} RSD`;
  }

  getDiscountedPrice(): number {
    if (!this.discount) return this.price;
    return Math.round(this.price * (1 - this.discount / 100));
  }

  getDiscountAmount(): number {
    return this.price - this.getDiscountedPrice();
  }

  hasDiscount(): boolean {
    return !!this.discount && this.discount > 0;
  }

  isInStock(): boolean {
    return this.inStock;
  }

  toCartItem(quantity = 1): ICartItem {
    return { productId: this.id, quantity };
  }

  static fromJSON(data: IProduct): Product {
    return new Product(data);
  }
}
