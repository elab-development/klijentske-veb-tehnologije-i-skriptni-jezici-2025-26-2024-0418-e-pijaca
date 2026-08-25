import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Order } from '../models/Order';
import Button from '../components/Button';

const mockOrders: Order[] = [
  new Order({ id: 'EP-48213', date: '18. jun 2026.', status: 'Dostavljeno', total: 2840, itemCount: 5 }),
  new Order({ id: 'EP-49120', date: '28. jun 2026.', status: 'Poslato', total: 1560, itemCount: 3 }),
  new Order({ id: 'EP-50334', date: '02. jul 2026.', status: 'U obradi', total: 920, itemCount: 2 }),
];

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/prijava" replace />;
  }

  return (
    <div className="section profile">
      <div className="profile__head">
        <div className="profile__avatar" aria-hidden="true">{user.initials()}</div>
        <div className="profile__name">
          <h1>{user.fullName()}</h1>
          <p className="muted">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>Odjavi se</Button>
      </div>

      <div className="profile__grid">
        <div className="profile__card">
          <h3>Podaci o nalogu</h3>
          <div className="profile__field"><span className="muted">Telefon</span><span>{user.phone || '—'}</span></div>
          <div className="profile__field"><span className="muted">Adresa</span><span>{user.address || '—'}</span></div>
          <div className="profile__field"><span className="muted">Član od</span><span>{user.memberSince}</span></div>
          <div className="profile__field"><span className="muted">Proizvoda u korpi</span><span>{count}</span></div>
        </div>

        <div className="profile__card">
          <h3>Istorija porudžbina</h3>
          {mockOrders.map((o) => (
            <div key={o.id} className="order-row">
              <div className="order-row__main">
                <strong>{o.id}</strong>
                <span className="muted">{o.date}</span>
              </div>
              <div className="order-row__side">
                <span>{o.itemCount} proizvoda</span>
                <span>{o.total} RSD</span>
                <span className={`status status--${o.status.toLowerCase().replace(/\s+/g, '-')}`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
