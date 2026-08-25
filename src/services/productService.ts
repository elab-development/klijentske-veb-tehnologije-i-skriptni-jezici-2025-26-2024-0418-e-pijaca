import type { IProduct, Category } from '../models/interfaces';
import { Product } from '../models/Product';
import { productRepository } from '../data/repositories';

const EXTERNAL_API = 'https://fakestoreapi.com/products';

/**
 * Spoljni API #1: live fetch sa fakestoreapi.com.
 * Koristi se za demo "Preporuke sa spoljnog kataloga" na početnoj strani,
 * uz loading/error stanja (useFetch). Glavni katalog je lokalni seed.
 */
export async function fetchExternalProducts(): Promise<IProduct[]> {
  try {
    const res = await fetch(EXTERNAL_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Array<Record<string, unknown>>;
    return data.slice(0, 6).map((d, i) => ({
      id: 1000 + i,
      name: String(d.title ?? 'Proizvod'),
      category: 'Začini' as Category,
      price: Math.round(Number(d.price ?? 1) * 100),
      unit: 'kom',
      producerId: 6,
      rating: Number((d.rating as { rate?: number } | undefined)?.rate ?? 4.5),
      ratingCount: Number((d.rating as { count?: number } | undefined)?.count ?? 0),
      soldCount: 0,
      image: '🛒',
      description: String(d.description ?? ''),
      inStock: true,
    }));
  } catch {
    return [];
  }
}

export function getAllProducts(): IProduct[] {
  return productRepository.getAll();
}
export function getProductById(id: number): IProduct | undefined {
  return productRepository.getById(id);
}
export function getProductsByCategory(cat: Category | 'Sve'): IProduct[] {
  return productRepository.getByCategory(cat);
}
export function toProduct(data: IProduct): Product {
  return Product.fromJSON(data);
}
export function effectivePrice(p?: IProduct): number {
  if (!p) return 0;
  return p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
}
