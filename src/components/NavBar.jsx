import { NavLink } from 'react-router';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products">Products</NavLink>
      </div>
    </nav>
  );
}

export default NavBar;