import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { member, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Primary navigation">
        <Link className="brand" to="/"><span>✦</span> Campus Éclat</Link>
        <div className="nav-links">
          <NavLink to="/events">Événements</NavLink>
          {member ? (
            <>
              {isAdmin && <NavLink to="/admin">Administration</NavLink>}
              <NavLink to="/profile">Mon espace</NavLink>
              <button className="button button-quiet" onClick={handleLogout}>Déconnexion</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Connexion</NavLink>
              <NavLink className="button" to="/register">Créer un compte</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
