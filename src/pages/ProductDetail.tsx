import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, toProduct } from '../services/productService';
import { producers, reviews } from '../data/products';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import StarRating from '../components/StarRating';
import Button from '../components/Button';

type Tab = 'opis' | 'detalji' | 'recenzije';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(Number(id));
  const { addItem } = useCart();
  const { format } = useCurrency();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>('opis');

  if (!product) {
    return (
      <div className="section empty">
        <span className="empty__emoji">😕</span>
        <p>Proizvod nije pronađen.</p>
        <Link to="/proizvodi"><Button variant="outline">Nazad na proizvode</Button></Link>
      </div>
    );
  }

  const p = toProduct(product);
  const producer = producers.find((x) => x.id === p.producerId);
  const productReviews = reviews.filter((r) => r.productId === p.id);

  return (
    <div className="detail">
      <div className="section detail__grid">
        <div className="detail__gallery">
          <div className="detail__main-img" aria-hidden="true">{p.image}</div>
          <div className="detail__thumbs">
            <span className="detail__thumb is-active">{p.image}</span>
            <span className="detail__thumb">📦</span>
            <span className="detail__thumb">🏞️</span>
          </div>
        </div>

        <div className="detail__info">
          <span className="pcard__cat">{p.category}</span>
          <h1 className="detail__title">{p.name}</h1>
          <div className="detail__meta">
            <StarRating rating={p.rating} count={p.ratingCount} size="md" />
            <span className="muted">· {p.soldCount}+ prodata</span>
          </div>
          {producer && <p className="muted detail__producer">👨‍🌾 {producer.name} · {producer.location}, {producer.region}</p>}

          <div className="detail__price">
            {p.hasDiscount() && <span className="pcard__old">{format(p.price)}</span>}
            <span className="detail__now">{format(p.getDiscountedPrice())}</span>
            <span className="muted">/ {p.unit}</span>
            {p.hasDiscount() && <span className="pcard__badge">-{p.discount}%</span>}
          </div>

          <div className="qty" role="group" aria-label="Količina">
            <button className="qty__btn" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Smanji">−</button>
            <span className="qty__val">{qty}</span>
            <button className="qty__btn" onClick={() => setQty((q) => q + 1)} aria-label="Povećaj">+</button>
          </div>

          <Button size="lg" className="detail__add" disabled={!p.inStock} onClick={() => addItem(p.id, qty)}>
            {p.inStock ? `🛒 Dodaj u korpu · ${format(p.getDiscountedPrice() * qty)}` : 'Nema na stanju'}
          </Button>

          {p.certificate && <p className="detail__cert">🏅 {p.certificate}</p>}
        </div>
      </div>

      <div className="section">
        <div className="tabs">
          <button className={`tabs__btn ${tab === 'opis' ? 'is-active' : ''}`.trim()} onClick={() => setTab('opis')}>Opis</button>
          <button className={`tabs__btn ${tab === 'detalji' ? 'is-active' : ''}`.trim()} onClick={() => setTab('detalji')}>Detalji</button>
          <button className={`tabs__btn ${tab === 'recenzije' ? 'is-active' : ''}`.trim()} onClick={() => setTab('recenzije')}>Recenzije ({productReviews.length})</button>
        </div>
        <div className="tabs__panel">
          {tab === 'opis' && <p className="detail__desc">{p.description}</p>}
          {tab === 'detalji' && (
            <ul className="detail__specs">
              {p.sorta && <li><span>Sorta</span><span>{p.sorta}</span></li>}
              {p.pakovanje && <li><span>Pakovanje</span><span>{p.pakovanje}</span></li>}
              {p.berba && <li><span>Berba</span><span>{p.berba}</span></li>}
              {p.rok && <li><span>Rok trajanja</span><span>{p.rok}</span></li>}
              {producer && <li><span>Proizvođač</span><span>{producer.name}</span></li>}
              {producer && <li><span>Region</span><span>{producer.region}</span></li>}
            </ul>
          )}
          {tab === 'recenzije' && (
            productReviews.length > 0 ? (
              <div className="reviews">
                {productReviews.map((r) => (
                  <div key={r.id} className="review">
                    <div className="review__head">
                      <strong>{r.author}</strong>
                      <StarRating rating={r.rating} showNumber={false} />
                    </div>
                    <span className="muted review__date">{r.date}</span>
                    <p className="review__text">{r.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">Još uvek nema recenzija. Budite prvi koji će oceniti!</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
