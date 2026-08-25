import { Link } from 'react-router-dom';
import type { IProduct } from '../models/interfaces';
import { toProduct } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import StarRating from './StarRating';
import Button from './Button';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const p = toProduct(product);
  const { addItem } = useCart();
  const { format } = useCurrency();

  return (
    <article className="pcard">
      <Link to={`/proizvod/${p.id}`} className="pcard__media">
        <span className="pcard__emoji" aria-hidden="true">{p.image}</span>
        {p.hasDiscount() && <span className="pcard__badge">-{p.discount}%</span>}
        {!p.inStock && <span className="pcard__out">Rasprodato</span>}
      </Link>
      <div className="pcard__body">
        <span className="pcard__cat">{p.category}</span>
        <h3 className="pcard__name">
          <Link to={`/proizvod/${p.id}`}>{p.name}</Link>
        </h3>
        <StarRating rating={p.rating} count={p.ratingCount} />
        <div className="pcard__price">
          {p.hasDiscount() && <span className="pcard__old">{format(p.price)}</span>}
          <span className="pcard__now">{format(p.getDiscountedPrice())}</span>
          <span className="pcard__unit">/ {p.unit}</span>
        </div>
        <Button size="sm" className="pcard__add" disabled={!p.inStock} onClick={() => addItem(p.id)}>
          {p.inStock ? '🛒 Dodaj u korpu' : 'Nema na stanju'}
        </Button>
      </div>
    </article>
  );
}
