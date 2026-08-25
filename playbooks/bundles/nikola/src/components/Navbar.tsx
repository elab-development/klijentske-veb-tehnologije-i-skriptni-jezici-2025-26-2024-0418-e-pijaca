import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import CartBadge from './CartBadge';
import Avatar from './Avatar';

const links = [
  { to: '/', label: 'Početna', end: true },
  { to: '/proizvodi', label: 'Proizvodi' },
  { to: '/korpa', label: 'Korpa' },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-emoji" aria-hidden="true">🌿</span> e-Pijaca
        </Link>
        <nav className="navbar__nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`.trim()}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <SearchBar className="navbar__search" />
        <div className="navbar__actions">
          <CartBadge />
          <Avatar />
        </div>
      </div>
    </header>
  );
}
