import styles from './PageTransition.module.css';

function PageTransition({ children, pathname }) {
  return (
    <div key={pathname} className={styles.transition}>
      {children}
    </div>
  );
}

export default PageTransition;
