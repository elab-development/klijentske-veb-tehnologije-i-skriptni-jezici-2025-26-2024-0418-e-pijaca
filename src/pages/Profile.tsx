import { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const recentOrdersList = [
  {
    id: '#2026-0847',
    date: '03. maj 2026.',
    itemsCount: 5,
    total: 3420,
    status: 'U dostavi',
    statusClass: 'status--delivering',
  },
  {
    id: '#2026-0812',
    date: '27. april 2026.',
    itemsCount: 8,
    total: 5890,
    status: 'Isporučeno',
    statusClass: 'status--completed',
  },
  {
    id: '#2026-0765',
    date: '12. april 2026.',
    itemsCount: 3,
    total: 1840,
    status: 'Isporučeno',
    statusClass: 'status--completed',
  },
];

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const { format } = useCurrency();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('licni-podaci');
  const [isEditing, setIsEditing] = useState(false);

  const [phoneVal, setPhoneVal] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [addressVal, setAddressVal] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    if (user) {
      const savedDataRaw = localStorage.getItem(`user_profile_custom_${user.email}`);
      if (savedDataRaw) {
        try {
          const savedData = JSON.parse(savedDataRaw);
          setPhoneVal(savedData.phone || user.phone || '060 123 4567');
          setAddressVal(savedData.address || user.address || 'Bulevar Despota Stefana 12, 11000 Beograd');
          setBirthDate(savedData.birthDate || '29.08.2005.');
          return;
        } catch {
          // fallback
        }
      }

      setPhoneVal(user.phone || '060 123 4567');
      setAddressVal(user.address || 'Bulevar Despota Stefana 12, 11000 Beograd');
      const userBirthDate = (user as unknown as { birthDate?: string }).birthDate;
      setBirthDate(userBirthDate || '29.08.2005.');
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/prijava" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleEditSave = () => {
    if (isEditing) {
      const profileToSave = {
        phone: phoneVal,
        address: addressVal,
        birthDate: birthDate,
      };
      localStorage.setItem(`user_profile_custom_${user.email}`, JSON.stringify(profileToSave));

      if (user.phone !== undefined) user.phone = phoneVal;
      if (user.address !== undefined) user.address = addressVal;

      setIsEditing(false);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    } else {
      setIsEditing(true);
    }
  };

  const navMenuItems = [
    { key: 'licni-podaci', label: 'Lični podaci', icon: '👤' },
    { key: 'moje-porudzbine', label: 'Moje porudžbine', icon: '📦' },
    { key: 'adrese-dostave', label: 'Adrese dostave', icon: '📍' },
    { key: 'nacini-placanja', label: 'Načini plaćanja', icon: '💳' },
    { key: 'lista-zelja', label: 'Lista želja', icon: '❤️' },
    { key: 'obavestenja', label: 'Obaveštenja', icon: '🔔' },
    { key: 'bezbednost', label: 'Bezbednost', icon: '🛡️' },
  ];

  return (
    <div className="section figma-profile-page">
      <div className="figma-profile-layout">
        <aside className="figma-profile-sidebar">
          <div className="figma-profile-user-card">
            <div className="figma-profile-avatar-circle">
              {user.initials ? user.initials() : 'JL'}
            </div>
            <h2 className="figma-profile-name">{user.fullName ? user.fullName() : 'Korisnik'}</h2>
            <p className="figma-profile-member-since">
              {user.memberSince ? `Član od ${user.memberSince}` : 'Član od marta 2024.'}
            </p>
            <div className="figma-profile-vip-badge">
              <span>🏆</span> Stalni kupac
            </div>
          </div>

          <nav className="figma-profile-menu">
            {navMenuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`figma-menu-item ${activeTab === item.key ? 'is-active' : ''}`}
                onClick={() => setActiveTab(item.key)}
              >
                <span className="figma-menu-icon">{item.icon}</span>
                <span className="figma-menu-label">{item.label}</span>
              </button>
            ))}

            <button
              type="button"
              className="figma-menu-item figma-menu-item--logout"
              onClick={handleLogout}
            >
              <span className="figma-menu-icon">↩️</span>
              <span className="figma-menu-label">Odjavi se</span>
            </button>
          </nav>
        </aside>

        <main className="figma-profile-main-content">
          <div className="figma-profile-header-row">
            <div>
              <h1 className="figma-profile-page-title">Lični podaci</h1>
              <p className="figma-profile-page-subtitle">
                Upravljajte svojim profilom, kontaktima i preferencijama.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {saveSuccessMsg && (
                <span style={{ color: '#2E7D32', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✓ Izmene sačuvane!
                </span>
              )}
              <button
                type="button"
                className="figma-profile-edit-btn"
                onClick={handleToggleEditSave}
              >
                {isEditing ? '💾 Sačuvaj' : '✏️ Izmeni'}
              </button>
            </div>
          </div>

          <div className="figma-stats-grid">
            <div className="figma-stat-card">
              <span className="figma-stat-number">47</span>
              <span className="figma-stat-title">Ukupno porudžbina</span>
            </div>

            <div className="figma-stat-card">
              <span className="figma-stat-number">184.350</span>
              <span className="figma-stat-title">Potrošeno (RSD)</span>
            </div>

            <div className="figma-stat-card">
              <span className="figma-stat-number">12</span>
              <span className="figma-stat-title">Lista želja</span>
            </div>

            <div className="figma-stat-card">
              <span className="figma-stat-number">2.450</span>
              <span className="figma-stat-title">
                Bonus poeni <strong className="figma-stat-highlight">1 poen = 1 RSD</strong>
              </span>
            </div>
          </div>

          <div className="figma-card-box">
            <h3 className="figma-card-heading">Osnovni podaci</h3>

            <div className="figma-data-rows-list">
              <div className="figma-data-row">
                <span className="figma-data-label">Ime i prezime</span>
                <strong className="figma-data-val">{user.fullName ? user.fullName() : 'Korisnik'}</strong>
              </div>

              <div className="figma-data-row">
                <span className="figma-data-label">E-mail</span>
                <div className="figma-data-val-with-badge">
                  <span className="figma-data-val">{user.email}</span>
                  <span className="figma-green-verified-tag">✓ Verifikovan</span>
                </div>
              </div>

              <div className="figma-data-row">
                <span className="figma-data-label">Telefon</span>
                <div className="figma-data-val-with-badge">
                  {isEditing ? (
                    <input
                      className="figma-inline-input"
                      value={phoneVal}
                      onChange={(e) => setPhoneVal(e.target.value)}
                      placeholder="060 123 4567"
                    />
                  ) : (
                    <span className="figma-data-val">{phoneVal || user.phone || 'Nije uneto'}</span>
                  )}
                  <span className="figma-green-verified-tag">✓ Verifikovan</span>
                </div>
              </div>

              <div className="figma-data-row">
                <span className="figma-data-label">Datum rođenja</span>
                {isEditing ? (
                  <input
                    className="figma-inline-input"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="29.08.2005."
                  />
                ) : (
                  <strong className="figma-data-val">{birthDate || 'Nije uneto'}</strong>
                )}
              </div>

              <div className="figma-data-row">
                <span className="figma-data-label">Primarna adresa</span>
                {isEditing ? (
                  <input
                    className="figma-inline-input"
                    value={addressVal}
                    onChange={(e) => setAddressVal(e.target.value)}
                    placeholder="Ulica i broj, Grad"
                  />
                ) : (
                  <span className="figma-data-val">{addressVal || user.address || 'Nije uneto'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="figma-card-box">
            <div className="figma-card-box-header">
              <h3 className="figma-card-heading">Poslednje porudžbine</h3>
              <Link to="/porudzbine" className="figma-see-all-link">
                Vidi sve →
              </Link>
            </div>

            <div className="figma-orders-list">
              {recentOrdersList.map((order) => (
                <div key={order.id} className="figma-order-row-item">
                  <div className="figma-order-lead">
                    <div className="figma-order-box-icon">📦</div>
                    <div className="figma-order-info-text">
                      <strong className="figma-order-code">Porudžbina {order.id}</strong>
                      <span className="figma-order-date-count">
                        {order.date} · {order.itemsCount} proizvoda
                      </span>
                    </div>
                  </div>

                  <div className="figma-order-side-info">
                    <strong className="figma-order-total-price">{format(order.total)}</strong>
                    <span className={`figma-status-pill ${order.statusClass}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}