import { Outlet } from 'react-router';
import NavBar from './NavBar.jsx';

function Layout() {
  return (
    <div className="app">
      <NavBar />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">Mini Shop – Assignment 7</footer>
    </div>
  );
}

export default Layout;