import { NavLink } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Navbar.module.css';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' }
];

function Navbar({ theme, toggleTheme }) {
  return (
    <header className={styles.header}>
      <div className={styles.navShell}>
        <NavLink className={styles.brand} to="/">
          <span className={styles.brandMark}>M/</span>
          <span>Manav Studio</span>
        </NavLink>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
    </header>
  );
}

export default Navbar;
