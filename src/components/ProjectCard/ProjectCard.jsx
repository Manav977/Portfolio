import styles from './ProjectCard.module.css';

function ProjectCard({ project, index = 0 }) {
  const techStack = Array.isArray(project.techStack) ? project.techStack : [];

  return (
    <article
      className={`${styles.card} ${index % 3 === 1 ? styles.offsetCard : ''}`}
      data-accent={project.accent || 'sun'}
    >
      <div className={styles.mediaWrap}>
        <img
          src={project.imageUrl}
          alt={project.title}
          className={styles.image}
          loading="lazy"
        />
        {project.featured ? <span className={styles.badge}>Featured</span> : null}
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3>{project.title}</h3>
          <span className={styles.index}>0{index + 1}</span>
        </div>

        <p>{project.description}</p>

        <div className={styles.techList}>
          {techStack.map((tech) => (
            <span key={tech} className={styles.techItem}>
              {tech}
            </span>
          ))}
        </div>

        <div className={styles.links}>
          <a href={project.liveLink} target="_blank" rel="noreferrer">
            Live
          </a>
          <a href={project.githubLink} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
