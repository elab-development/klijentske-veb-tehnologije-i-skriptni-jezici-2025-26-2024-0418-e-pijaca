import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { getProductById, toProduct } from '../services/productService';
import { producers } from '../data/products';
import type { ICartItem } from '../models/interfaces';
import { Order } from '../models/Order';
import Button from '../components/Button';

const PDV_PERCENTAGE = 0.2;
const SHIPPING_PER_SELLER = 290;

const CHECKOUT_STAGES = [
  { stageNum: 1, stepTitle: 'Korak 1', stepSubtitle: 'Pregled korpe' },
  { stageNum: 2, stepTitle: 'Korak 2', stepSubtitle: 'Adresa i dostava' },
  { stageNum: 3, stepTitle: 'Korak 3', stepSubtitle: 'Plaćanje' },
  { stageNum: 4, stepTitle: 'Korak 4', stepSubtitle: 'Potvrda' },
];

const CITIES_LIST = [
  'Beograd',
  'Novi Sad',
  'Niš',
  'Kragujevac',
  'Subotica',
  'Čačak',
  'Šabac',
  'Valjevo',
  'Kraljevo',
  'Zrenjanin',
  'Pančevo',
  'Užice',
] as const;

interface RecipientDeliveryData {
  recipientName: string;
  recipientPhone: string;
  deliveryStreet: string;
  deliveryCity: string;
  courierNote: string;
}

export default function Cart() {
  const {
    items,
    count,
    subtotal,
    discountAmount,
    discountCode,
    updateQty,
    removeItem,
    applyDiscount,
    clear,
  } = useCart();
  const { format } = useCurrency();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [promoVoucherInput, setPromoVoucherInput] = useState('');
  const [promoFeedbackText, setPromoFeedbackText] = useState('');
  const [submittedOrderRef, setSubmittedOrderRef] = useState<string | null>(null);
  const [chosenPaymentType, setChosenPaymentType] = useState<'pouzece' | 'kartica'>('pouzece');
  const [paymentCardData, setPaymentCardData] = useState({
    cardNum: '',
    cardHolder: '',
    expirationDate: '',
    cvcCode: '',
  });
  const [recipientData, setRecipientData] = useState<RecipientDeliveryData>({
    recipientName: '',
    recipientPhone: '',
    deliveryStreet: '',
    deliveryCity: 'Beograd',
    courierNote: '',
  });

  const cartGroupedByProducer = items.reduce<Record<number, ICartItem[]>>((acc, cartRow) => {
    const matchedProduct = getProductById(cartRow.productId);
    if (!matchedProduct) return acc;
    const sellerId = matchedProduct.producerId;
    if (!acc[sellerId]) acc[sellerId] = [];
    acc[sellerId].push(cartRow);
    return acc;
  }, {});

  const totalDistinctSellers = Object.keys(cartGroupedByProducer).length;
  const deliveryFeeTotal = totalDistinctSellers * SHIPPING_PER_SELLER;
  const productsSubtotalAmount = subtotal;
  const appliedDiscountValue = discountAmount > 0 ? discountAmount : (discountCode ? Math.round(productsSubtotalAmount * 0.1) : 0);
  const includedPdvAmount = Math.round((productsSubtotalAmount - appliedDiscountValue) * PDV_PERCENTAGE);
  const grandPayableTotal = productsSubtotalAmount - appliedDiscountValue + (items.length ? deliveryFeeTotal : 0);

  if (submittedOrderRef) {
    return (
      <div className="section empty">
        <span className="empty__emoji">✅</span>
        <h2>Porudžbina uspešno poslata!</h2>
        <p>Broj porudžbine: <strong>{submittedOrderRef}</strong></p>
        <p className="muted">Hvala na kupovini! Poslaćemo email sa detaljima dostave.</p>
        <Link to="/proizvodi"><Button>Nastavi kupovinu</Button></Link>
      </div>
    );
  }

  if (count === 0 && currentStageIdx === 0) {
    return (
      <div className="section empty">
        <span className="empty__emoji">🛒</span>
        <h2>Vaša korpa je prazna</h2>
        <p className="muted">Pregledajte naše sveže domaće proizvode.</p>
        <Link to="/proizvodi"><Button>Pogledaj ponudu</Button></Link>
      </div>
    );
  }

  const handleVoucherSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isSuccess = applyDiscount(promoVoucherInput.trim().toUpperCase());
    if (isSuccess) {
      setPromoFeedbackText(`Kod ${promoVoucherInput.trim().toUpperCase()} je uspešno primenjen!`);
      setPromoVoucherInput('');
    } else {
      setPromoFeedbackText('Neispravan promo kod.');
    }
  };

  const handleRecipientFieldChange = (keyName: keyof RecipientDeliveryData) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setRecipientData((prev) => ({ ...prev, [keyName]: e.target.value }));

  const finalizeOrderPlacement = () => {
    const createdOrder = new Order({
      id: Order.generateId(),
      date: new Date().toLocaleDateString('sr-RS'),
      status: 'U obradi',
      total: grandPayableTotal,
      itemCount: count,
    });
    clear();
    setSubmittedOrderRef(createdOrder.id);
  };

  const advanceToNextStage = () => setCurrentStageIdx((prev) => Math.min(prev + 1, CHECKOUT_STAGES.length - 1));
  const retreatToPreviousStage = () => setCurrentStageIdx((prev) => Math.max(prev - 1, 0));

  return (
    <div className="section cart-screen-container">
      {/* Top Stepper */}
      <div className="figma-stepper">
        {CHECKOUT_STAGES.map((stage, idx) => {
          const isActive = idx === currentStageIdx;
          const isDone = idx < currentStageIdx;
          return (
            <div key={stage.stageNum} className={`figma-step ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}>
              <div className="figma-step__num">{isDone ? '✓' : stage.stageNum}</div>
              <div className="figma-step__labels">
                <span className="figma-step__sub">{stage.stepTitle}</span>
                <strong className="figma-step__main">{stage.stepSubtitle}</strong>
              </div>
              {idx < CHECKOUT_STAGES.length - 1 && <div className="figma-step__line" />}
            </div>
          );
        })}
      </div>

      {/* Title & Top Action */}
      <div className="figma-cart-header">
        <div>
          <h1 className="figma-cart-title">Vaša korpa</h1>
          <p className="figma-cart-meta">
            {count} {count === 1 ? 'proizvod' : 'proizvoda'} od {totalDistinctSellers} proizvođača · ukupno 4.250 g
          </p>
        </div>
        <Link to="/proizvodi" className="figma-continue-btn">
          ← Nastavi kupovinu
        </Link>
      </div>

      <div className="figma-cart-layout">
        {/* Main Left Column */}
        <div className="figma-cart-main">
          {currentStageIdx === 0 && (
            <div className="figma-cart-groups">
              {Object.entries(cartGroupedByProducer).map(([sellerId, sellerItems]) => {
                const seller = producers.find((p) => p.id === Number(sellerId));
                const initials = seller?.name
                  ? seller.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : 'OP';

                const groupSubtotal = sellerItems.reduce((acc, it) => {
                  const p = getProductById(it.productId);
                  return p ? acc + toProduct(p).getDiscountedPrice() * it.quantity : acc;
                }, 0);

                return (
                  <div key={sellerId} className="figma-producer-card">
                    <div className="figma-producer-head">
                      <div className="figma-producer-avatar">{initials}</div>
                      <div className="figma-producer-info">
                        <strong>{seller?.name ?? 'Proizvođač'}</strong>
                        <span>📍 {seller?.location} · dostava sutra</span>
                      </div>
                      <div className="figma-verified-badge">
                        <span>✓</span> Verifikovan
                      </div>
                    </div>

                    <div className="figma-products-list">
                      {sellerItems.map((cartItem) => {
                        const product = getProductById(cartItem.productId);
                        if (!product) return null;
                        const prodEntity = toProduct(product);
                        const effectivePrice = prodEntity.getDiscountedPrice();
                        const rowTotal = effectivePrice * cartItem.quantity;

                        return (
                          <div key={cartItem.productId} className="figma-cart-item">
                            <div className="figma-item-img-box">
                              {product.image && product.image.startsWith('http') ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="figma-item-img"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=150&q=80';
                                  }}
                                />
                              ) : (
                                <span className="figma-item-emoji">🍎</span>
                              )}
                            </div>

                            <div className="figma-item-details">
                              <Link to={`/proizvod/${product.id}`} className="figma-item-name">
                                {product.name}
                              </Link>
                              <div className="figma-item-package">
                                {product.pakovanje || product.unit} · {format(effectivePrice)} / {product.unit}
                              </div>
                              <div className="figma-item-badges">
                                <span className="figma-badge figma-badge--bio">BIO</span>
                                <span className="figma-badge figma-badge--fresh">Sveža berba</span>
                              </div>
                            </div>

                            <div className="figma-qty-ctrl">
                              <button
                                type="button"
                                className="figma-qty-btn"
                                onClick={() => updateQty(cartItem.productId, cartItem.quantity - 1)}
                              >
                                −
                              </button>
                              <span className="figma-qty-val">{cartItem.quantity}</span>
                              <button
                                type="button"
                                className="figma-qty-btn"
                                onClick={() => updateQty(cartItem.productId, cartItem.quantity + 1)}
                              >
                                +
                              </button>
                            </div>

                            <div className="figma-item-price-side">
                              <div className="figma-item-total-price">{format(rowTotal)}</div>
                              <button
                                type="button"
                                className="figma-item-remove"
                                onClick={() => removeItem(cartItem.productId)}
                              >
                                🗑 Ukloni
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="figma-producer-foot">
                      <div className="figma-delivery-info">
                        🚚 Dostava od ovog proizvođača: 290 RSD · Besplatno preko 3.000 RSD
                      </div>
                      <div className="figma-group-subtotal">
                        <span>Međuzbir</span>
                        <strong>{format(groupSubtotal)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentStageIdx === 1 && (
            <div className="figma-step-card">
              <h3>Podaci za dostavu</h3>
              <div className="delivery-form">
                <label className="field">
                  <span className="field__label">Ime i prezime</span>
                  <input
                    className="field__input"
                    value={recipientData.recipientName}
                    onChange={handleRecipientFieldChange('recipientName')}
                    placeholder="Petar Petrović"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Telefon</span>
                  <input
                    className="field__input"
                    value={recipientData.recipientPhone}
                    onChange={handleRecipientFieldChange('recipientPhone')}
                    placeholder="+381 60 123 4567"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Adresa</span>
                  <input
                    className="field__input"
                    value={recipientData.deliveryStreet}
                    onChange={handleRecipientFieldChange('deliveryStreet')}
                    placeholder="Ulica i broj"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Grad</span>
                  <select
                    className="field__input"
                    value={recipientData.deliveryCity}
                    onChange={handleRecipientFieldChange('deliveryCity')}
                  >
                    {CITIES_LIST.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span className="field__label">Napomena za kurira (opciono)</span>
                  <textarea
                    className="field__input"
                    rows={3}
                    value={recipientData.courierNote}
                    onChange={handleRecipientFieldChange('courierNote')}
                    placeholder="npr. ostaviti kod komšije"
                  />
                </label>
              </div>
              <div className="cart__actions">
                <Button variant="ghost" onClick={retreatToPreviousStage}>← Nazad na korpu</Button>
                <Button onClick={advanceToNextStage} disabled={!recipientData.recipientName || !recipientData.deliveryStreet || !recipientData.recipientPhone}>
                  Nastavi → Plaćanje
                </Button>
              </div>
            </div>
          )}

          {currentStageIdx === 2 && (
            <div className="figma-step-card">
              <h3>Način plaćanja</h3>
              <div className="payment">
                <label className={`payment__option ${chosenPaymentType === 'pouzece' ? 'is-active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={chosenPaymentType === 'pouzece'}
                    onChange={() => setChosenPaymentType('pouzece')}
                  />
                  <span>💵 Pouzeće (gotovina kuriru)</span>
                </label>
                <label className={`payment__option ${chosenPaymentType === 'kartica' ? 'is-active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={chosenPaymentType === 'kartica'}
                    onChange={() => setChosenPaymentType('kartica')}
                  />
                  <span>💳 Kartica online</span>
                </label>
              </div>
              {chosenPaymentType === 'kartica' && (
                <div className="delivery-form">
                  <label className="field">
                    <span className="field__label">Broj kartice</span>
                    <input
                      className="field__input"
                      value={paymentCardData.cardNum}
                      onChange={(e) => setPaymentCardData({ ...paymentCardData, cardNum: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                    />
                  </label>
                  <label className="field">
                    <span className="field__label">Ime na kartici</span>
                    <input
                      className="field__input"
                      value={paymentCardData.cardHolder}
                      onChange={(e) => setPaymentCardData({ ...paymentCardData, cardHolder: e.target.value })}
                      placeholder="PETAR PETROVIĆ"
                    />
                  </label>
                  <div className="auth__row">
                    <label className="field">
                      <span className="field__label">Datum isteka</span>
                      <input
                        className="field__input"
                        value={paymentCardData.expirationDate}
                        onChange={(e) => setPaymentCardData({ ...paymentCardData, expirationDate: e.target.value })}
                        placeholder="MM/GG"
                      />
                    </label>
                    <label className="field">
                      <span className="field__label">CVC</span>
                      <input
                        className="field__input"
                        value={paymentCardData.cvcCode}
                        onChange={(e) => setPaymentCardData({ ...paymentCardData, cvcCode: e.target.value })}
                        placeholder="123"
                      />
                    </label>
                  </div>
                </div>
              )}
              <div className="cart__actions">
                <Button variant="ghost" onClick={retreatToPreviousStage}>← Nazad na dostavu</Button>
                <Button onClick={advanceToNextStage}>Nastavi → Potvrda</Button>
              </div>
            </div>
          )}

          {currentStageIdx === 3 && (
            <div className="figma-step-card">
              <h3>Pregled i potvrda</h3>
              <div className="confirm">
                <div className="confirm__block">
                  <h4>Dostava</h4>
                  <p>{recipientData.recipientName}</p>
                  <p>{recipientData.deliveryStreet}, {recipientData.deliveryCity}</p>
                  <p className="muted">{recipientData.recipientPhone}</p>
                  {recipientData.courierNote && <p className="muted">Napomena: {recipientData.courierNote}</p>}
                </div>
                <div className="confirm__block">
                  <h4>Plaćanje</h4>
                  <p>{chosenPaymentType === 'pouzece' ? '💵 Pouzeće' : '💳 Kartica'}</p>
                </div>
                <div className="confirm__block">
                  <h4>Proizvodi ({count})</h4>
                  {items.map((it) => {
                    const p = getProductById(it.productId);
                    return p ? <p key={it.productId}>{p.name} × {it.quantity}</p> : null;
                  })}
                </div>
              </div>
              <div className="cart__actions">
                <Button variant="ghost" onClick={retreatToPreviousStage}>← Nazad</Button>
                <Button variant="primary" size="lg" onClick={finalizeOrderPlacement}>
                  ✅ Naruči · {format(grandPayableTotal)}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Figma Summary Sidebar */}
        <aside className="figma-cart-sidebar">
          <div className="figma-summary-card">
            <h3 className="figma-summary-title">Pregled porudžbine</h3>

            <div className="figma-summary-row">
              <span>Međuzbir ({count} proizvoda)</span>
              <strong>{format(productsSubtotalAmount)}</strong>
            </div>

            <div className="figma-summary-row figma-summary-row--discount">
              <span>Popust - PROLECE2026</span>
              <strong>− {format(appliedDiscountValue || 465)}</strong>
            </div>

            <div className="figma-summary-row">
              <span>Dostava ({totalDistinctSellers} proizvođača)</span>
              <strong>{format(deliveryFeeTotal || 870)}</strong>
            </div>

            <div className="figma-summary-row">
              <span>PDV (uključen)</span>
              <strong>{format(includedPdvAmount)}</strong>
            </div>

            <div className="figma-summary-divider" />

            <div className="figma-summary-total">
              <span>Ukupno za naplatu</span>
              <span className="figma-total-amount">{format(grandPayableTotal)}</span>
            </div>

            <div className="figma-delivery-banner">
              <span className="figma-delivery-banner-icon">🚚</span>
              <div>
                <strong>Procenjena dostava</strong>
                <p>Sutra, ponedeljak 11. maj · između 9h i 14h</p>
              </div>
            </div>

            {currentStageIdx === 0 && (
              <button
                type="button"
                className="figma-btn-checkout"
                onClick={advanceToNextStage}
              >
                Idi na plaćanje →
              </button>
            )}

            {currentStageIdx === 0 && (
              <form className="promo" onSubmit={handleVoucherSubmit}>
                <div className="promo__row">
                  <input
                    className="field__input"
                    value={promoVoucherInput}
                    onChange={(e) => setPromoVoucherInput(e.target.value)}
                    placeholder="PROLECE2026"
                  />
                  <Button size="sm" type="submit">Primeni</Button>
                </div>
                {promoFeedbackText && <p className="field__error">{promoFeedbackText}</p>}
              </form>
            )}

            {count > 0 && currentStageIdx === 0 && (
              <div style={{ textAlign: 'center', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={clear}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🗑️ Isprazni celu korpu
                </button>
              </div>
            )}
          </div>

          {/* Payment Badges */}
          <div className="figma-payment-card">
            <h4>Načini plaćanja</h4>
            <div className="figma-payment-pills">
              <span className="figma-pill">VISA</span>
              <span className="figma-pill">MC</span>
              <span className="figma-pill">DINA</span>
              <span className="figma-pill">💳</span>
              <span className="figma-pill">💵</span>
            </div>
            <p>Plaćanje karticom, mobilnim novčanikom ili pouzećem pri preuzimanju.</p>
          </div>

          {/* Trust Cards */}
          <div className="figma-trust-card">
            <div className="figma-trust-item">
              <span className="figma-trust-icon">🛡️</span>
              <div>
                <strong>Garancija svežine</strong>
                <p>Povraćaj novca u 24h ako proizvod ne odgovara</p>
              </div>
            </div>
            <div className="figma-trust-item">
              <span className="figma-trust-icon">📞</span>
              <div>
                <strong>Podrška 7 dana u nedelji</strong>
                <p>Pišite nam · odgovor u roku od 1 sata</p>
              </div>
            </div>
            <div className="figma-trust-item">
              <span className="figma-trust-icon">🌱</span>
              <div>
                <strong>Direktno od proizvođača</strong>
                <p>Bez posrednika · pravičnija cena za seljaka</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}