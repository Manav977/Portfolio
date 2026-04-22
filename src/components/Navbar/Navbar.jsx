import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMobileMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.navShell}>
          <NavLink className={styles.brand} to="/">
            <span className={styles.brandMark}>M/</span>
            <span className={styles.brandName}>Manav Studio</span>
          </NavLink>

          <div className={styles.rightGroup}>
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

            <button className={styles.burger} onClick={toggleMobileMenu} aria-label="Open Menu">
              <span className={styles.burgerLine}></span>
              <span className={styles.burgerLine}></span>
              <span className={styles.burgerLine}></span>
            </button>
          </div>
        </div>
      </header>

      {/* SIDEBAR - Iska z-index header se zyada hai */}
      <div className={`${styles.sidebarOverlay} ${isMobileMenuOpen ? styles.overlayVisible : ''}`}>
        <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`} ref={menuRef}>
          
          {/* Close Button Inside Sidebar */}
          <button className={styles.closeBtn} onClick={closeMenu} aria-label="Close Menu">
            <div className={styles.crossLine}></div>
            <div className={styles.crossLine}></div>
          </button>

          <div className={styles.mobileNav}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileActive : ''}`}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

export default Navbar;