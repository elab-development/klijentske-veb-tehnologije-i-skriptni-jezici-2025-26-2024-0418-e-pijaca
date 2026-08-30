import { Link } from 'react-router-dom';
import type { IProduct } from '../models/interfaces';
import { toProduct } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

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
        <img src={p.image} alt={p.name} className="pcard__img" />
        
        <div className="pcard__badges">
          {p.hasDiscount() && <span className="badge badge--red">-{p.discount}%</span>}
          {p.certificate?.includes('BIO') && <span className="badge badge--green">BIO</span>}
        </div>
      </Link>
      
      <div className="pcard__body">
        <span className="pcard__producer-info">Poljoprivredno gazdinstvo · Srbija</span>
        
        <h3 className="pcard__name">
          <Link to={`/proizvod/${p.id}`}>{p.name}</Link>
        </h3>
        
        <div className="pcard__rating-row">
          <span className="star-icon">⭐</span>
          <span className="rating-val">{p.rating}</span>
          <span className="rating-count">· ({p.ratingCount})</span>
        </div>

        <div className="pcard__footer">
          <div className="pcard__price-col">
            <div className="price-main">
              <span className="pcard__now">{format(p.getDiscountedPrice())}</span>
              <span className="pcard__unit">/ {p.unit}</span>
            </div>
            {p.hasDiscount() && <span className="pcard__old">{format(p.price)}</span>}
          </div>

          <button 
            className="add-btn-round" 
            disabled={!p.inStock} 
            onClick={() => addItem(p.id)}
            aria-label="Dodaj u korpu"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}