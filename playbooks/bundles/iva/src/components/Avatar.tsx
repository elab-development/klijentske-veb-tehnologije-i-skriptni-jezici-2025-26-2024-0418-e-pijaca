import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Avatar() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return <Link to="/prijava" className="avatar avatar--guest">Prijava</Link>;
  }
  return (
    <Link to="/profil" className="avatar" title={user.fullName()} aria-label={user.fullName()}>
      {user.initials()}
    </Link>
  );
}
