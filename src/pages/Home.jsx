import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal/Reveal';
import styles from './Home.module.css';

function Home() {
  const processCards = [
    {
      title: 'Design language',
      detail: 'Build a tone first. Then shape typography, spacing, and interaction around it.'
    },
    {
      title: 'Frontend depth',
      detail: 'Keep the UI expressive, but the code maintainable enough to hand off cleanly.'
    },
    {
      title: 'Admin sanity',
      detail: 'Content should be editable without turning every update into a redeploy.'
    }
  ];

  return (
    <section className={styles.home}>
      <Reveal className={styles.introShell}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Developer + Designer</span>
          <h1>
            I build interfaces that feel
            <span> sharp, tactile, and alive.</span>
          </h1>
          <p>
            Full-stack work with a product brain, a front-end obsession, and just enough
            asymmetry to make things memorable.
          </p>

          <div className={styles.actions}>
            <Link className={styles.primaryBtn} to="/projects">
              View Work
            </Link>
            <Link className={styles.secondaryBtn} to="/contact">
              Contact
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.orbitCard}>
            <span className={styles.label}>Current mode</span>
            <strong>Shipping thoughtful web products</strong>
            <p>React, Node , Express, Firebase, design systems, and clean admin tools.</p>
          </div>

          <div className={styles.metricRibbon}>
            <div>
              <span>Focus</span>
              <strong>UI systems</strong>
            </div>
            <div>
              <span>Stack</span>
              <strong>React + Express</strong>
            </div>
          </div>

          <div className={styles.fragmentA} />
          <div className={styles.fragmentB} />
        </div>
      </Reveal>

      <Reveal className={styles.storyBand}>
        <div className={styles.storyCard}>
          <span>Brand feeling</span>
          <p>Soft gradients, bold type, sharp details, and a little friction in the grid.</p>
        </div>
        <div className={styles.storyCard}>
          <span>How I work</span>
          <p>Research the edges, simplify the center, and make the interaction feel human.</p>
        </div>
      </Reveal>

      <Reveal className={styles.expandedBand}>
        <div className={styles.featurePanel}>
          <span className={styles.panelKicker}>Selected focus</span>
          <h2>Interfaces with more character than noise.</h2>
          <p>
            I like landing pages with a point of view, dashboards that feel calm under pressure,
            and systems that stay editable after launch.
          </p>
          <div className={styles.miniStats}>
            <div>
              <strong>Frontend</strong>
              <span>React architecture, motion, systems</span>
            </div>
            <div>
              <strong>Backend</strong>
              <span>Node JS , Express , Firebase, content flows, admin tooling</span>
            </div>
          </div>
        </div>

        <div className={styles.processStack}>
          {processCards.map((item) => (
            <div key={item.title} className={styles.processCard}>
              <span>{item.title}</span>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export default Home;
