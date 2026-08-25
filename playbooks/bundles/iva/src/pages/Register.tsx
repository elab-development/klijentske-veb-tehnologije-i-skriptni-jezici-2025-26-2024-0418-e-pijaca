import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import Button from '../components/Button';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({ firstName: '', lastName: '', email: '', phone: '', address: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key: keyof RegisterForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Ime, prezime, email i lozinka su obavezni.');
      return;
    }
    setLoading(true);
    await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, address: form.address });
    setLoading(false);
    navigate('/profil');
  };

  return (
    <div className="auth">
      <form className="auth__card auth__card--wide" onSubmit={handleSubmit}>
        <h1 className="auth__title">Registracija</h1>
        <p className="muted auth__sub">Postanite član e-Pijace i naručujte sveže proizvode.</p>
        <div className="auth__row">
          <FormField label="Ime" name="firstName" placeholder="Jovan" value={form.firstName} onChange={update('firstName')} icon="👤" />
          <FormField label="Prezime" name="lastName" placeholder="Luković" value={form.lastName} onChange={update('lastName')} icon="👤" />
        </div>
        <FormField label="Email adresa" name="email" type="email" placeholder="ime@example.com" value={form.email} onChange={update('email')} icon="✉️" />
        <div className="auth__row">
          <FormField label="Telefon" name="phone" placeholder="+381 60 123 4567" value={form.phone} onChange={update('phone')} icon="📱" />
          <FormField label="Lozinka" name="password" type="password" placeholder="••••••••" value={form.password} onChange={update('password')} icon="🔒" />
        </div>
        <FormField label="Adresa dostave" name="address" placeholder="Ulica i broj, grad" value={form.address} onChange={update('address')} icon="📍" />
        {error && <p className="field__error">{error}</p>}
        <Button type="submit" size="lg" className="auth__submit" disabled={loading}>
          {loading ? 'Registracija…' : 'Registruj se'}
        </Button>
        <p className="auth__switch">
          Već imate nalog? <Link to="/prijava">Prijavite se</Link>
        </p>
      </form>
    </div>
  );
}
