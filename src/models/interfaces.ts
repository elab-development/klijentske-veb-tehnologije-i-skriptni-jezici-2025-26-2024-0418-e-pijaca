export type Category = 'Voće' | 'Povrće' | 'Mlečni' | 'Med' | 'Jaja' | 'Začini';

export interface IProducer {
  id: number;
  name: string;
  location: string;
  region: string;
  products: string;
  rating: number;
  sales: number;
}

export interface IProduct {
  id: number;
  name: string;
  category: Category;
  price: number;
  discount?: number; 
  unit: string; 
  producerId: number;
  rating: number;
  ratingCount: number;
  soldCount: number;
  image: string;
  description: string;
  inStock: boolean;
  certificate?: string;
  sorta?: string;
  pakovanje?: string;
  berba?: string;
  rok?: string;
  ratingBreakdown?: number[];
}

export interface ICartItem {
  productId: number;
  quantity: number;
}

export interface IReview {
  id: number;
  productId: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
}

export interface IOrder {
  id: string;
  date: string;
  status: 'U obradi' | 'Poslato' | 'Dostavljeno';
  total: number;
  itemCount: number;
}

export interface IRepository<T> {
  getAll(): T[];
  getById(id: number): T | undefined;
  filter(predicate: (item: T) => boolean): T[];
  paginate(items: T[], page: number, perPage: number): T[];
}
