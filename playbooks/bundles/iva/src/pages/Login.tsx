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
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Prijava</h1>
        <p className="muted auth__sub">Dobrodošli nazad! Ulogujte se da nastavite kupovinu.</p>
        <FormField label="Email adresa" name="email" type="email" placeholder="ime@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon="✉️" autoComplete="email" />
        <FormField label="Lozinka" name="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon="🔒" autoComplete="current-password" />
        {error && <p className="field__error">{error}</p>}
        <Button type="submit" size="lg" className="auth__submit" disabled={loading}>
          {loading ? 'Prijava…' : 'Prijavi se'}
        </Button>
        <p className="auth__switch">
          Nemate nalog? <Link to="/registracija">Registrujte se</Link>
        </p>
        <p className="muted auth__demo">Demo: bilo koji email i lozinka radi.</p>
      </form>
    </div>
  );
}
