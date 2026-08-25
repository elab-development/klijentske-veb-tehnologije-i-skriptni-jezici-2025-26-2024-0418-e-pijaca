import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  value?: string;
  onChange?: (v: string) => void;
  onSearch?: (v: string) => void;
  navigateOnSubmit?: boolean;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  navigateOnSubmit = true,
  placeholder = 'Pretraži proizvode, proizvođače...',
  className = '',
}: SearchBarProps) {
  const [local, setLocal] = useState('');
  const navigate = useNavigate();
  const current = value ?? local;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(current);
    if (navigateOnSubmit) navigate(`/proizvodi?q=${encodeURIComponent(current)}`);
  };

  return (
    <form className={`search ${className}`.trim()} onSubmit={handleSubmit} role="search">
      <input
        type="search"
        className="search__input"
        placeholder={placeholder}
        value={current}
        onChange={(e) => (onChange ? onChange(e.target.value) : setLocal(e.target.value))}
        aria-label="Pretraga"
      />
      <button type="submit" className="search__btn" aria-label="Pretraži">🔍</button>
    </form>
  );
}
