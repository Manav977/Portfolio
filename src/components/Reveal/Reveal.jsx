import { useReveal } from '../../hooks/useReveal';
import styles from './Reveal.module.css';

function Reveal({ children, className = '' }) {
  const { ref, isVisible } = useReveal();

  return (
    <div ref={ref} className={`${styles.reveal} ${isVisible ? styles.visible : ''} ${className}`}>
      {children}
    </div>
  );
}

export default Reveal;
