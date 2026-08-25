import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { getProductById, toProduct } from '../services/productService';
import { producers } from '../data/products';
import type { ICartItem } from '../models/interfaces';
import { Order } from '../models/Order';
import Button from '../components/Button';

const PDV_RATE = 0.2;
const DELIVERY = 250;

const STEPS = ['Korpa', 'Dostava', 'Plaćanje', 'Potvrda'] as const;

interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  note: string;
}

export default function Cart() {
  const { items, count, subtotal, discountAmount, discountCode, total, updateQty, removeItem, applyDiscount, clear } = useCart();
  const { format } = useCurrency();
  const [step, setStep] = useState(0);
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');
  const [placed, setPlaced] = useState<string | null>(null);
  const [payment, setPayment] = useState<'pouzece' | 'kartica'>('pouzece');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' });
  const [delivery, setDelivery] = useState<DeliveryInfo>({ name: '', phone: '', address: '', city: '', note: '' });

  const pdv = Math.round((subtotal - discountAmount) * PDV_RATE);
  const grandTotal = subtotal - discountAmount + pdv + (items.length ? DELIVERY : 0);

  if (placed) {
    return (
      <div className="section empty">
        <span className="empty__emoji">✅</span>
        <h2>Porudžbina uspešno poslata!</h2>
        <p>Broj porudzbine: <strong>{placed}</strong></p>
        <p className="muted">Hvala na kupovini! Poslaćemo email sa detaljima dostave.</p>
        <Link to="/proizvodi"><Button>Nastavi kupovinu</Button></Link>
      </div>
    );
  }

  if (count === 0 && step === 0) {
    return (
      <div className="section empty">
        <span className="empty__emoji">🛒</span>
        <h2>Vaša korpa je prazna</h2>
        <p className="muted">Pregledajte naše sveže domaće proizvode.</p>
        <Link to="/proizvodi"><Button>Pogledaj ponudu</Button></Link>
      </div>
    );
  }

  const grouped = items.reduce<Record<number, ICartItem[]>>((acc, item) => {
    const p = getProductById(item.productId);
    if (!p) return acc;
    const key = p.producerId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const handleCode = (e: FormEvent) => {
    e.preventDefault();
    const ok = applyDiscount(code.trim().toUpperCase());
    if (ok) {
      setCodeMsg(`Kod ${code.trim().toUpperCase()} primenjen!`);
      setCode('');
    } else {
      setCodeMsg('Neispravan kod.');
    }
  };

  const updateDelivery = (key: keyof DeliveryInfo) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDelivery((d) => ({ ...d, [key]: e.target.value }));

  const placeOrder = () => {
    const order = new Order({
      id: Order.generateId(),
      date: new Date().toLocaleDateString('sr-RS'),
      status: 'U obradi',
      total: grandTotal,
      itemCount: count,
    });
    clear();
    setPlaced(order.id);
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="section cart">
      <h1 className="cart__title">Korpa i naručivanje</h1>

      <ol className="stepper">
        {STEPS.map((label, i) => (
          <li key={label} className={`stepper__step ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`.trim()}>
            <span className="stepper__num">{i < step ? '✓' : i + 1}</span>
            <span className="stepper__label">{label}</span>
          </li>
        ))}
      </ol>

      <div className="cart__body">
        <div className="cart__main">
          {step === 0 && (
            <div className="cart__step">
              {Object.entries(grouped).map(([pid, group]) => {
                const producer = producers.find((x) => x.id === Number(pid));
                return (
                  <div key={pid} className="cart__group">
                    <div className="cart__group-head">
                      👨‍🌾 {producer?.name ?? 'Proizvođač'} · <span className="muted">{producer?.location}</span>
                    </div>
                    {group.map((item) => {
                      const p = getProductById(item.productId);
                      if (!p) return null;
                      const prod = toProduct(p);
                      const lineTotal = prod.getDiscountedPrice() * item.quantity;
                      return (
                        <div key={item.productId} className="cart__item">
                          <span className="cart__item-emoji" aria-hidden="true">{p.image}</span>
                          <div className="cart__item-info">
                            <Link to={`/proizvod/${p.id}`} className="cart__item-name">{p.name}</Link>
                            <span className="muted">{format(prod.getDiscountedPrice())} / {p.unit}</span>
                          </div>
                          <div className="qty qty--sm">
                            <button className="qty__btn" onClick={() => updateQty(item.productId, item.quantity - 1)} aria-label="Smanji">−</button>
                            <span className="qty__val">{item.quantity}</span>
                            <button className="qty__btn" onClick={() => updateQty(item.productId, item.quantity + 1)} aria-label="Povećaj">+</button>
                          </div>
                          <span className="cart__item-total">{format(lineTotal)}</span>
                          <button className="cart__remove" onClick={() => removeItem(item.productId)} aria-label="Ukloni">🗑</button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div className="cart__actions">
                <Link to="/proizvodi"><Button variant="ghost">← Nastavi kupovinu</Button></Link>
                <Button onClick={next}>Nastavi → Dostava</Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="cart__step">
              <h3>Podaci za dostavu</h3>
              <div className="delivery-form">
                <label className="field"><span className="field__label">Ime i prezime</span><input className="field__input" value={delivery.name} onChange={updateDelivery('name')} placeholder="Jovan Luković" /></label>
                <label className="field"><span className="field__label">Telefon</span><input className="field__input" value={delivery.phone} onChange={updateDelivery('phone')} placeholder="+381 60 123 4567" /></label>
                <label className="field"><span className="field__label">Adresa</span><input className="field__input" value={delivery.address} onChange={updateDelivery('address')} placeholder="Ulica i broj" /></label>
                <label className="field"><span className="field__label">Grad</span><input className="field__input" value={delivery.city} onChange={updateDelivery('city')} placeholder="Novi Sad" /></label>
                <label className="field"><span className="field__label">Napomena (opciono)</span><textarea className="field__input" rows={3} value={delivery.note} onChange={updateDelivery('note')} placeholder="npr. ostaviti kod komšije" /></label>
              </div>
              <div className="cart__actions">
                <Button variant="ghost" onClick={back}>← Nazad</Button>
                <Button onClick={next} disabled={!delivery.name || !delivery.address || !delivery.phone}>Nastavi → Plaćanje</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="cart__step">
              <h3>Način plaćanja</h3>
              <div className="payment">
                <label className={`payment__option ${payment === 'pouzece' ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" checked={payment === 'pouzece'} onChange={() => setPayment('pouzece')} />
                  <span>💵 Pouzece (gotovina kuriru)</span>
                </label>
                <label className={`payment__option ${payment === 'kartica' ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" checked={payment === 'kartica'} onChange={() => setPayment('kartica')} />
                  <span>💳 Kartica online</span>
                </label>
              </div>
              {payment === 'kartica' && (
                <div className="delivery-form">
                  <label className="field"><span className="field__label">Broj kartice</span><input className="field__input" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="1234 5678 9012 3456" /></label>
                  <label className="field"><span className="field__label">Ime na kartici</span><input className="field__input" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="JOVAN LUKOVIC" /></label>
                  <div className="auth__row">
                    <label className="field"><span className="field__label">Datum isteka</span><input className="field__input" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="MM/GG" /></label>
                    <label className="field"><span className="field__label">CVC</span><input className="field__input" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} placeholder="123" /></label>
                  </div>
                </div>
              )}
              <div className="cart__actions">
                <Button variant="ghost" onClick={back}>← Nazad</Button>
                <Button onClick={next}>Nastavi → Potvrda</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="cart__step">
              <h3>Pregled i potvrda</h3>
              <div className="confirm">
                <div className="confirm__block">
                  <h4>Dostava</h4>
                  <p>{delivery.name}</p>
                  <p>{delivery.address}, {delivery.city}</p>
                  <p className="muted">{delivery.phone}</p>
                  {delivery.note && <p className="muted">Napomena: {delivery.note}</p>}
                </div>
                <div className="confirm__block">
                  <h4>Plaćanje</h4>
                  <p>{payment === 'pouzece' ? '💵 Pouzece' : '💳 Kartica'}</p>
                </div>
                <div className="confirm__block">
                  <h4>Proizvodi ({count})</h4>
                  {items.map((item) => {
                    const p = getProductById(item.productId);
                    return p ? <p key={item.productId}>{p.image} {p.name} × {item.quantity}</p> : null;
                  })}
                </div>
              </div>
              <div className="cart__actions">
                <Button variant="ghost" onClick={back}>← Nazad</Button>
                <Button variant="primary" size="lg" onClick={placeOrder}>✅ Naruči · {format(grandTotal)}</Button>
              </div>
            </div>
          )}
        </div>

        <aside className="cart__summary">
          <h3>Rekapitulacija</h3>
          <div className="summary-row"><span>Vrednost proizvoda</span><span>{format(subtotal)}</span></div>
          {discountAmount > 0 && <div className="summary-row summary-row--discount"><span>Popust ({discountCode})</span><span>−{format(discountAmount)}</span></div>}
          <div className="summary-row"><span>PDV (20%)</span><span>{format(pdv)}</span></div>
          <div className="summary-row"><span>Dostava</span><span>{format(DELIVERY)}</span></div>
          <div className="summary-row summary-row--total"><span>Ukupno</span><span>{format(grandTotal)}</span></div>

          {step === 0 && (
            <form className="promo" onSubmit={handleCode}>
              <label className="field__label">Kod za popust</label>
              <div className="promo__row">
                <input className="field__input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="npr. PIJACA10" />
                <Button size="sm" type="submit">Primeni</Button>
              </div>
              {codeMsg && <p className="field__error">{codeMsg}</p>}
              {discountCode && <p className="muted">Aktivan kod: {discountCode}</p>}
            </form>
          )}
          <p className="muted cart__hint">Isprobaj kodove <strong>PIJACA10</strong> ili <strong>NOVO5</strong>.</p>
        </aside>
      </div>
    </div>
  );
}
