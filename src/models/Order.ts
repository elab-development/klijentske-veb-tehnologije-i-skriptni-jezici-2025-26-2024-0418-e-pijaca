import type { IOrder } from './interfaces';

export class Order implements IOrder {
  id!: string;
  date!: string;
  status!: IOrder['status'];
  total!: number;
  itemCount!: number;

  constructor(data: IOrder) {
    Object.assign(this, data);
  }

  static generateId(): string {
    const n = Math.floor(Math.random() * 900000 + 100000);
    return `EP-${n}`;
  }

  summary(): string {
    return `${this.id} · ${this.itemCount} proizvoda · ${this.total} RSD · ${this.status}`;
  }
}
