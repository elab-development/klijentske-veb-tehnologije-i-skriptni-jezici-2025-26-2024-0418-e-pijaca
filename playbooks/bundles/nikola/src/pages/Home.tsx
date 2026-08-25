import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, fetchExternalProducts } from '../services/productService';
import { producers, categories } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import type { IProduct } from '../models/interfaces';

export default function Home() {
  const { format, currency, setCurrency, rates } = useCurrency();
  const products = getAllProducts();
  const featured = products.filter((p) => p.rating >= 4.7).slice(0, 4);
  const seasonal = products.filter((p) => p.discount).slice(0, 3);

  const [external, setExternal] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExternalProducts()
      .then((list) => setExternal(list))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__text">
          <span className="hero__eyebrow">🌿 Pravo iz bašte na vaš sto</span>
          <h1 className="hero__title">Sveže sa pijace, direktno do vrata.</h1>
          <p className="hero__sub">
            Naručite domaće proizvode od proverenih srpskih proizvođača. Bez posrednika, sa ukusom prave seoske bašte.
          </p>
          <div className="hero__cta">
            <Link to="/proizvodi"><Button size="lg">Pogledaj ponudu</Button></Link>
            <Link to="/registracija"><Button variant="outline" size="lg">Postani član</Button></Link>
          </div>
        </div>
        <div className="hero__art" aria-hidden="true">🧺</div>
      </section>

      <section className="section">
        <h2 className="section__title">Kupuj po kategorijama</h2>
        <div className="catgrid">
          {categories.map((c) => (
            <Link key={c.key} to={`/proizvodi?kategorija=${encodeURIComponent(c.key)}`} className="catcard">
              <span className="catcard__emoji" aria-hidden="true">{c.emoji}</span>
              <span className="catcard__label">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Preporučujemo</h2>
          <span className="section__hint">
            Cene u:{' '}
            <button className="currency-toggle" onClick={() => setCurrency(currency === 'RSD' ? 'EUR' : 'RSD')}>
              {currency}
            </button>
          </span>
        </div>
        <div className="grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {seasonal.length > 0 && (
        <section className="section section--promo">
          <h2 className="section__title">Sezona akcija 🏷</h2>
          <div className="grid">
            {seasonal.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="section__title">Naši proizvođači</h2>
        <div className="producergrid">
          {producers.map((pr) => (
            <div key={pr.id} className="producercard">
              <div className="producercard__head">
                <span className="producercard__emoji" aria-hidden="true">👨‍🌾</span>
                <div>
                  <h3>{pr.name}</h3>
                  <span className="muted">{pr.location} · {pr.region}</span>
                </div>
              </div>
              <p className="muted">{pr.products}</p>
              <div className="producercard__stats">
                <span>★ {pr.rating}</span>
                <span>{pr.sales}+ porudžbina</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">
          Preporuke sa spoljnog kataloga <span className="muted">(live API · fakestoreapi.com)</span>
        </h2>
        {loading ? (
          <p className="muted">Učitavanje…</p>
        ) : external.length === 0 ? (
          <p className="muted">Spoljni API trenutno nedostupan — prikazujemo samo lokalni katalog.</p>
        ) : (
          <div className="grid">
            {external.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {rates && <p className="muted">Live kurs: 1 € = {rates.RSD.toFixed(2)} RSD · format primera: {format(420)}</p>}
      </section>
    </div>
  );
}
