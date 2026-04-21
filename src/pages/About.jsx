import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import styles from './About.module.css';

const skills = [
  { label: 'Interface Design', note: 'systems, motion, hierarchy' },
  { label: 'Frontend Engineering', note: 'React, state, architecture' },
  { label: 'Backend Thinking', note: 'Firebase, data flows, DX' },
  { label: 'Product Sense', note: 'clarity, polish, decisions' },
  { label: 'Creative Direction', note: 'mood, texture, brand feel' }
];

function About() {
  return (
    <section className={styles.about}>
      <Reveal>
        <SectionHeading
          eyebrow="About"
          title="I like products that are quietly ambitious."
          description="I sit between product design and engineering, which usually means the details actually make it to production."
        />
      </Reveal>

      <div className={styles.layout}>
        <Reveal className={styles.story}>
          <p>
            I am a full-stack developer focused on expressive front-end systems and practical
            back-end tooling. My favorite projects are the ones that balance personality with
            usefulness: a strong visual point of view, but no drama in the user flow.
          </p>
          <p>
            I care about shape, rhythm, copy, performance, accessibility, and the weird tiny
            moments that make a site feel considered instead of assembled.
          </p>
        </Reveal>

        <Reveal className={styles.skillField}>
          {skills.map((skill, index) => (
            <div
              key={skill.label}
              className={`${styles.skillCard} ${index % 2 === 0 ? styles.raise : styles.lower}`}
            >
              <strong>{skill.label}</strong>
              <span>{skill.note}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export default About;
