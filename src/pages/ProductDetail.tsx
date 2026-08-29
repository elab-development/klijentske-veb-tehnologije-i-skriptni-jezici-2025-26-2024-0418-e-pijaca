import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, toProduct } from '../services/productService';
import { producers, reviews } from '../data/products';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import StarRating from '../components/StarRating';
import Button from '../components/Button';

type Tab = 'opis' | 'detalji' | 'recenzije' | 'proizvodjac' | 'pitanja';

const ratingLabels = [5, 4, 3, 2, 1];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(Number(id));
  const { addItem } = useCart();
  const { format } = useCurrency();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>('recenzije'); 

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
  const totalPrice = p.getDiscountedPrice() * qty;

  return (
    <div className="detail">
      <div className="marketplace__top">
        <div className="breadcrumbs">
          <Link to="/">Početna</Link> &gt; <Link to="/proizvodi">Proizvodi</Link> &gt; <Link to={`/kategorija/${p.category.toLowerCase()}`}>{p.category}</Link> &gt; <span>{p.name}</span>
        </div>
      </div>

      <div className="section detail__grid">
        {/* Galerija sa pravom glavnom slikom i brojčenim thumbnail kutijama kao u Figmi */}
        <div className="detail__gallery">
          <div className="detail__main-img">
            <div className="detail__badges">
              {p.certificate?.toUpperCase().includes('BIO') && <span className="badge badge--green">BIO sertifikat</span>}
              {p.hasDiscount() && <span className="badge badge--red">-{p.discount}% POPUST</span>}
            </div>
            <img src={p.image} alt={p.name} />
          </div>
          <div className="detail__thumbs">
            <div className="detail__thumb is-active">1</div>
            <div className="detail__thumb">2</div>
            <div className="detail__thumb">3</div>
            <div className="detail__thumb">4</div>
          </div>
        </div>

        <div className="detail__info">
          {producer && (
             <div className="detail__producer-tag">
               <span className="detail__producer-avatar">VM</span>
               <span className="detail__producer-name">{producer.name} - {producer.region}</span>
               <span className="figma-verified-badge">✓ Verifikovan</span>
             </div>
          )}
          
          <h1 className="detail__title">{p.name}</h1>
          
          <div className="detail__meta">
            <StarRating rating={p.rating} count={p.ratingCount} size="md" />
            <span className="muted">· {p.ratingCount} ocena · {p.soldCount}+ prodatih</span>
          </div>

          <div className="detail__price-box">
            <div className="detail__price-main">
                <span className="detail__now">{format(p.getDiscountedPrice())}</span>
                {p.hasDiscount() && <span className="detail__old">{format(p.price)}</span>}
                <span className="muted">/ {p.unit}</span>
                {p.hasDiscount() && <span className="detail__savings">Štediš {format(p.price - p.getDiscountedPrice())}</span>}
            </div>
            <p className="detail__price-tax">Cena uključuje PDV. Dostava se obračunava u korpi.</p>
          </div>

          <div className="detail__short-desc">
            <strong>Opis proizvoda</strong>
            <p>{p.description}</p>
          </div>

          <ul className="detail__specs-table">
            {p.sorta && <li><span>Sorta</span><strong>{p.sorta}</strong></li>}
            {p.pakovanje && <li><span>Pakovanje</span><strong>{p.pakovanje}</strong></li>}
            {p.berba && <li><span>Berba</span><strong>{p.berba}</strong></li>}
            {p.rok && <li><span>Rok upotrebe</span><strong>{p.rok}</strong></li>}
          </ul>

          <div className="detail__actions">
            <div className="qty" role="group" aria-label="Količina">
              <button className="qty__btn" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Smanji">−</button>
              <span className="qty__val">{qty}</span>
              <button className="qty__btn" onClick={() => setQty((q) => q + 1)} aria-label="Povećaj">+</button>
            </div>
            <Button size="lg" className="detail__add-btn" disabled={!p.inStock} onClick={() => addItem(p.id, qty)}>
              {p.inStock ? `Dodaj u korpu - ${format(totalPrice)}` : 'Nema na stanju'}
            </Button>
            <button className="detail__icon-btn">♡</button>
            <button className="detail__icon-btn">↗</button>
          </div>

          <div className="detail__delivery-info">
            <div className="delivery-item">
              <span className="delivery-icon">🚚</span>
              <div>
                <strong>Dostava sutra do podne</strong>
                <p>Beograd, Novi Sad — 290 RSD · ostali gradovi 390 RSD</p>
              </div>
            </div>
            <div className="delivery-item">
              <span className="delivery-icon">🛡️</span>
              <div>
                <strong>Zaštita kupca</strong>
                <p>Garancija kvaliteta — povraćaj novca u 24h ukoliko proizvod ne odgovara</p>
              </div>
            </div>
            <div className="delivery-item">
              <span className="delivery-icon">📍</span>
              <div>
                <strong>Pratite porudžbinu</strong>
                <p>Praćenje u realnom vremenu od berbe do isporuke</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section detail__bottom">
        <div className="tabs">
          <button className={`tabs__btn ${tab === 'opis' ? 'is-active' : ''}`} onClick={() => setTab('opis')}>Detaljan opis</button>
          <button className={`tabs__btn ${tab === 'recenzije' ? 'is-active' : ''}`} onClick={() => setTab('recenzije')}>Recenzije ({productReviews.length})</button>
          <button className={`tabs__btn ${tab === 'proizvodjac' ? 'is-active' : ''}`} onClick={() => setTab('proizvodjac')}>O proizvođaču</button>
          <button className={`tabs__btn ${tab === 'pitanja' ? 'is-active' : ''}`} onClick={() => setTab('pitanja')}>Pitanja i odgovori (18)</button>
        </div>
        
        <div className="tabs__panel">
          {tab === 'opis' && (
            <div className="detail__full-desc">
              <p>{p.description}</p>
              <ul className="detail__specs-table">
                {p.sorta && <li><span>Sorta</span><strong>{p.sorta}</strong></li>}
                {p.pakovanje && <li><span>Pakovanje</span><strong>{p.pakovanje}</strong></li>}
                {p.berba && <li><span>Berba</span><strong>{p.berba}</strong></li>}
                {p.rok && <li><span>Rok upotrebe</span><strong>{p.rok}</strong></li>}
                {p.certificate && <li><span>Sertifikat</span><strong>{p.certificate}</strong></li>}
              </ul>
            </div>
          )}

          {tab === 'proizvodjac' && producer && (
            <div className="detail__producer-panel">
              <div className="detail__producer-tag">
                <span className="detail__producer-avatar">{producer.name.substring(0, 2).toUpperCase()}</span>
                <div>
                  <strong className="detail__producer-name">{producer.name}</strong>
                  <p className="muted">{producer.location} · {producer.region}</p>
                </div>
                <span className="figma-verified-badge">✓ Verifikovan</span>
              </div>
              <ul className="detail__specs-table">
                <li><span>Proizvodi</span><strong>{producer.products}</strong></li>
                <li><span>Prosečna ocena</span><strong>{producer.rating} ★</strong></li>
                <li><span>Prodato artikala</span><strong>{producer.sales}+</strong></li>
              </ul>
            </div>
          )}

          {tab === 'pitanja' && (
            <div className="detail__qa-panel">
              <p className="muted">Još niko nije postavio pitanje o ovom proizvodu. Budite prvi!</p>
              <Button variant="outline">Postavi pitanje</Button>
            </div>
          )}

          {tab === 'recenzije' && (
            <div className="detail__reviews-layout">
                <div className="reviews-summary">
                    <div className="reviews-score">{p.rating}</div>
                    <StarRating rating={p.rating} count={0} size="lg" />
                    <p className="muted">Na osnovu {p.ratingCount} verifikovanih ocena</p>

                    {p.ratingBreakdown && (
                      <div className="rating-breakdown">
                        {ratingLabels.map((star, i) => (
                          <div className="rating-breakdown__row" key={star}>
                            <span className="rating-breakdown__label">{star} ★</span>
                            <div className="rating-breakdown__bar">
                              <div className="rating-breakdown__fill" style={{ width: `${p.ratingBreakdown![i]}%` }} />
                            </div>
                            <span className="rating-breakdown__pct">{p.ratingBreakdown![i]}%</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button variant="outline" className="write-review-btn">Napiši recenziju</Button>
                </div>
                <div className="reviews-list">
                  {productReviews.map((r) => (
                    <div key={r.id} className="review-card">
                      <div className="review__head">
                        <div className="review__author">
                            <span className="review__avatar">{r.author.substring(0,2).toUpperCase()}</span>
                            <strong>{r.author}</strong>
                            <span className="figma-verified-badge">✓ Verifikovana kupovina</span>
                        </div>
                        <span className="muted review__date">{r.date}</span>
                      </div>
                      <StarRating rating={r.rating} showNumber={false} />
                      <p className="review__text">{r.text}</p>
                    </div>
                  ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}