import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { useCartStore, selectItemCount } from '../store/cartStore.js';

function NavBar({ theme, onToggleTheme }) {
  const { user, logOut } = useAuth();
  const itemCount = useCartStore(selectItemCount);

  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/cart">Cart ({itemCount})</NavLink>
      </div>

      <div className="nav-actions">
        <button type="button" onClick={onToggleTheme}>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>

        {user ? (
          <>
            <span className="username">{user.username}</span>
            <button type="button" onClick={logOut}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavBar;