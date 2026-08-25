import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartBadge() {
  const { count } = useCart();
  return (
    <Link to="/korpa" className="cart-badge" aria-label={`Korpa, ${count} proizvoda`}>
      <span className="cart-badge__icon" aria-hidden="true">🛒</span>
      {count > 0 && <span className="cart-badge__count">{count}</span>}
    </Link>
  );
}
