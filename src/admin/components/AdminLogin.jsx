import { useEffect, useState } from 'react';
import {
  getAdminCooldownMs,
  isAdminAllowlistConfigured,
  loginAdmin,
  recordFailedAdminAttempt
} from '../../firebase/auth';
import styles from './AdminLogin.module.css';

const formatCooldown = (cooldownMs) => {
  const totalSeconds = Math.ceil(cooldownMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (!minutes) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
};

function AdminLogin({ onSuccess }) {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [cooldownMs, setCooldownMs] = useState(() => getAdminCooldownMs());
  const [status, setStatus] = useState({
    loading: false,
    error: ''
  });

  useEffect(() => {
    if (!cooldownMs) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCooldownMs(getAdminCooldownMs());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldownMs]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextCooldown = getAdminCooldownMs();

    if (nextCooldown > 0) {
      setCooldownMs(nextCooldown);
      setStatus({
        loading: false,
        error: `Too many attempts. Try again in ${formatCooldown(nextCooldown)}.`
      });
      return;
    }

    try {
      setStatus({ loading: true, error: '' });
      await loginAdmin(form.email, form.password);
      setCooldownMs(0);
      onSuccess();
    } catch (error) {
      if (error.message !== 'unauthorized-admin') {
        recordFailedAdminAttempt();
      }

      const updatedCooldown = getAdminCooldownMs();
      setCooldownMs(updatedCooldown);
      setStatus({
        loading: false,
        error:
          error.message === 'unauthorized-admin'
            ? 'This email is not allowed to access the admin dashboard.'
            : updatedCooldown
              ? `Too many failed attempts. Try again in ${formatCooldown(updatedCooldown)}.`
              : 'Login failed. Check your Firebase Auth credentials.'
      });
      return;
    }

    setStatus({ loading: false, error: '' });
  };

  return (
    <div className={styles.card}>
      <h2>Admin Login</h2>
      <p>Use your Firebase email and password to access the dashboard.</p>
      {isAdminAllowlistConfigured() ? (
        <p className={styles.note}>Only approved admin emails can sign in.</p>
      ) : (
        <p className={styles.note}>Set `VITE_ADMIN_EMAILS` in `.env` to lock this page to your email.</p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>

        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </label>

        <button type="submit" disabled={status.loading || cooldownMs > 0}>
          {status.loading ? 'Signing in...' : cooldownMs > 0 ? `Locked for ${formatCooldown(cooldownMs)}` : 'Sign In'}
        </button>
      </form>

      {status.error ? <p className={styles.error}>{status.error}</p> : null}
    </div>
  );
}

export default AdminLogin;
