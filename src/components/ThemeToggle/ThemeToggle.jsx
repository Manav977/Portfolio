import styles from './ThemeToggle.module.css';

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className={styles.track}>
        <span className={styles.thumb}>{theme === 'dark' ? 'LN' : 'DK'}</span>
      </span>
    </button>
  );
}

export default ThemeToggle;
