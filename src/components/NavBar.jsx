import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

function NavBar() {
  const { user, logOut } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products">Products</NavLink>
      </div>

      <div className="nav-actions">
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