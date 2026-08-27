import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import Button from '../components/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Unesite email i lozinku.');
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate('/profil');
    else setError('Neispravni podaci. Pokušajte ponovo.');
  };

 return (
  <div className="auth">
    <div className="auth__hero">
      <div className="auth__hero-logo">🌿 e-Pijaca</div>
      <h2 className="auth__hero-title">Sveže sa pijace,<br />direktno do vrata.</h2>
      <p className="auth__hero-desc">Domaći proizvodi proverenih srpskih proizvođača - voće, povrće, mlečni proizvodi i med, na jednom mestu.</p>
      <ul className="auth__hero-features">
        <li>🚜 Lokalni proizvođači u radijusu od 50 km</li>
        <li>📦 Dostava narednog dana</li>
        <li>📜 Sertifikat o poreklu za svaki proizvod</li>
      </ul>
    </div>
    <div className="auth__form-wrap">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Dobrodošli nazad</h1>
        <p className="muted auth__sub">Prijavite se na svoj nalog da biste nastavili sa kupovinom.</p>
       <FormField label="Email adresa" name="email" type="email" placeholder="ime@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <FormField label="Lozinka" name="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        {error && <p className="field_error">{error}</p>}
        <div className="auth__options">
          <label className="auth__checkbox">
            <input type="checkbox" /> Zapamti me na ovom uređaju
          </label>
          <a href="#" className="auth__forgot">Zaboravljena lozinka?</a>
        </div>
        <Button type="submit" size="lg" className="auth__submit" disabled={loading}>
          {loading ? 'Prijava…' : 'Nastavi'}
        </Button>
        <div className="auth__social">
          <button type="button" className="auth__social-btn">🔵 Google</button>
          <button type="button" className="auth__social-btn">📘 Facebook</button>
        </div>
        <p className="auth__switch">
          Nemate nalog? <Link to="/registracija">Registrujte se</Link>
        </p>
      </form>
    </div>
  </div>
);
}
