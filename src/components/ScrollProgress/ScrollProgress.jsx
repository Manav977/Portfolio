import { useScrollProgress } from '../../hooks/useScrollProgress';
import styles from './ScrollProgress.module.css';

function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className={styles.track} aria-hidden="true">
      <span className={styles.fill} style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}

export default ScrollProgress;
