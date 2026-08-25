import type { IProduct, IRepository, Category } from '../models/interfaces';
import { products } from './products';

export class ProductRepository implements IRepository<IProduct> {
  private data: IProduct[];

  constructor(data: IProduct[] = products) {
    this.data = data;
  }

  getAll(): IProduct[] {
    return [...this.data];
  }

  getById(id: number): IProduct | undefined {
    return this.data.find((p) => p.id === id);
  }

  filter(predicate: (item: IProduct) => boolean): IProduct[] {
    return this.data.filter(predicate);
  }

  paginate(items: IProduct[], page: number, perPage: number): IProduct[] {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }

  getByCategory(category: Category | 'Sve'): IProduct[] {
    if (category === 'Sve') return this.getAll();
    return this.filter((p) => p.category === category);
  }

  count(): number {
    return this.data.length;
  }
}

export const productRepository = new ProductRepository();
