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
    passwordConfirm?: string;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({ firstName: '', lastName: '', email: '', phone: '', address: '', password: '', passwordConfirm: '' });
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
  <div className="auth auth--single">
    <div className="auth__form-wrap">
      <form className="auth__card auth__card--wide" onSubmit={handleSubmit}>
        <h1 className="auth__title">Otvorite svoj nalog</h1>
        <p className="muted auth__sub">Unesite osnovne podatke kako biste počeli sa kupovinom domaćih proizvoda.</p>
        <div className="auth__row">
          <FormField label="Ime" name="firstName" placeholder="Jovan" value={form.firstName} onChange={update('firstName')} />
          <FormField label="Prezime" name="lastName" placeholder="Lukovic" value={form.lastName} onChange={update('lastName')} />
        </div>
        <FormField label="Email adresa" name="email" type="email" placeholder="ime@example.com" value={form.email} onChange={update('email')} />
        <FormField label="Broj telefona" name="phone" placeholder="+381 60 123 4567" value={form.phone} onChange={update('phone')} />
        <div className="auth__row">
          <FormField label="Lozinka" name="password" type="password" placeholder="Najmanje 8 karaktera" value={form.password} onChange={update('password')} />
          <FormField label="Potvrda lozinke" name="passwordConfirm" type="password" placeholder="Ponovite lozinku" value={form.passwordConfirm || ''} onChange={update('passwordConfirm' as keyof RegisterForm)} />
        </div>
        <div className="auth__strength">
          <div className="auth__strength-bar auth__strength-bar--filled"></div>
          <div className="auth__strength-bar auth__strength-bar--filled"></div>
          <div className="auth__strength-bar"></div>
          <div className="auth__strength-bar"></div>
        </div>
        <FormField label="Adresa dostave" name="address" placeholder="Ulica i broj, grad" value={form.address} onChange={update('address')} />
        {error && <p className="field_error">{error}</p>}
        <label className="auth__checkbox">
          <input type="checkbox" defaultChecked /> Slažem se sa Uslovima korišćenja i Politikom privatnosti e-Pijace.
        </label>
        <label className="auth__checkbox">
          <input type="checkbox" /> Želim da primam obaveštenja o novim proizvodima i sezonskim ponudama.
        </label>
        <Button type="submit" size="lg" className="auth__submit" disabled={loading}>
          {loading ? 'Registracija…' : 'Nastavi'}
        </Button>
        <p className="auth__switch">
          Već imate nalog? <Link to="/prijava">Prijavite se</Link>
        </p>
      </form>
    </div>
  </div>
);
 
}
