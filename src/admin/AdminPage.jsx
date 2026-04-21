import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import {
  ADMIN_SESSION_TIMEOUT_MS,
  isAdminAllowlistConfigured,
  isAllowedAdminEmail,
  logoutAdmin
} from '../firebase/auth';
import { auth } from '../firebase/config';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import styles from './AdminPage.module.css';

function AdminPage({ theme, toggleTheme }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (authUser) => {
        if (!isMounted) {
          return;
        }

        if (authUser && !isAllowedAdminEmail(authUser.email)) {
          await logoutAdmin();
          if (!isMounted) {
            return;
          }
          setUser(null);
          setLoading(false);
          setError('This account is not allowed to access the admin dashboard.');
          return;
        }

        setUser(authUser);
        setLoading(false);
        setError('');
      },
      () => {
        if (!isMounted) {
          return;
        }

        setError('Firebase auth is not initializing. Check your Firebase config values.');
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let timeoutId;

    const resetSessionTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(async () => {
        try {
          await logoutAdmin();
          setError('Admin session expired after inactivity. Please sign in again.');
        } catch (logoutError) {
          setError('Admin session could not be cleared cleanly. Please refresh the page.');
        }
      }, ADMIN_SESSION_TIMEOUT_MS);
    };

    const sessionEvents = ['pointerdown', 'keydown', 'scroll', 'visibilitychange'];
    sessionEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetSessionTimer);
    });
    resetSessionTimer();

    return () => {
      window.clearTimeout(timeoutId);
      sessionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetSessionTimer);
      });
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (logoutError) {
      setError('Could not log out right now. Please try again.');
    }
  };

  return (
    <section className={styles.adminPage}>
      <header className={styles.header}>
        <div>
          <Link to="/" className={styles.backLink}>
            Back to site
          </Link>
          <h1>Portfolio Admin</h1>
          <p>Manage projects, images, and the public resume from one place.</p>
        </div>

        <div className={styles.headerActions}>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          {user ? (
            <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
              Log out
            </button>
          ) : null}
        </div>
      </header>

      {error ? <p className={styles.error}>{error}</p> : null}
      {!isAdminAllowlistConfigured() ? (
        <p className={styles.warning}>
          Add `VITE_ADMIN_EMAILS` to `.env` so only your approved email can enter the admin area.
        </p>
      ) : null}
      {loading ? <div className={styles.loading}>Checking authentication...</div> : null}
      {!loading && !user ? <AdminLogin onSuccess={() => setError('')} /> : null}
      {!loading && user ? <AdminDashboard /> : null}
    </section>
  );
}

export default AdminPage;
