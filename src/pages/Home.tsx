import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import { producers, categories } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';


export default function Home() {
  const { format, currency, setCurrency, rates } = useCurrency();
  const products = getAllProducts();
  const featured = products.filter((p) => p.rating >= 4.7).slice(0, 4);
  const seasonal = products.filter((p) => p.discount).slice(0, 3);

  

  return (
    <div className="home">
      <section className="hero">
  <div className="hero__text">
    <h1 className="hero__title">Pravo iz bašte na vaš sto.</h1>
<p className="hero__sub">
  Povežite se direktno sa proizvođačima iz Srbije. Bez posrednika, bez preprodaje - samo sveže, sezonsko i dokazano domaće.
</p>
    <div className="hero__cta">
      <Link to="/proizvodi"><Button size="lg">Pogledaj ponudu</Button></Link>
      <Link to="/registracija"><Button variant="outline" size="lg">Postani prodavac</Button></Link>
    </div>
    <div className="hero__stats">
      <div className="hero__stat">
        <strong>420+</strong>
        <span>proizvođača</span>
      </div>
      <div className="hero__stat">
        <strong>12.000+</strong>
        <span>zadovoljnih kupaca</span>
      </div>
      <div className="hero__stat">
        <strong>4.9 ★</strong>
        <span>prosečna ocena</span>
      </div>
    </div>
  </div>
  <div className="hero__card">
    <span className="hero__card-label">Korpa nedelje</span>
    <h3 className="hero__card-title">Sezonska korpa - 8 proizvoda</h3>
    <ul className="hero__card-list">
      <li>Paradajz volovsko srce</li>
      <li>Krastavac mali</li>
      <li>Sir mladi domaći</li>
      <li>Med od bagrema</li>
      <li>Maline sveže</li>
    </ul>
    <div className="hero__card-footer">
      <span className="hero__card-price">2.890 RSD</span>
      <Button size="md">Dodaj u korpu</Button>
    </div>
  </div>
</section>

      <section className="section">
  <div className="section__head">
    <h2 className="section__title">Pretraži po kategoriji</h2>
    <Link to="/proizvodi" className="section__hint">Vidi sve →</Link>
  </div>
  <div className="catgrid">
    {categories.map((c) => (
      <Link key={c.key} to={`/proizvodi?kategorija=${encodeURIComponent(c.key)}`} className="catcard">
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
    {producers.map((pr, i) => (
      <div key={pr.id} className="producercard">
        <div className="producercard__head">
         <span className="producercard__avatar">
  {pr.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
</span>
          <div>
            <h3>{pr.name}</h3>
            <span className="muted">📍 {pr.location} · {pr.region}</span>
          </div>
        </div>
        <p className="muted">{pr.products}</p>
        <div className="producercard__stats">
          <span>★ {pr.rating} · {pr.sales}+ prodaja</span>
        </div>
      </div>
    ))}
  </div>
</section>
    </div>
  );
}
