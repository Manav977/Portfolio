import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import { getProjects } from '../firebase/projects';
import styles from './Projects.module.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: ''
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setStatus({ loading: true, error: '' });
        const loadedProjects = await getProjects();
        setProjects(loadedProjects);
      } catch (error) {
        setStatus({
          loading: false,
          error: 'Unable to load projects right now. Please check Firebase and try again.'
        });
        return;
      }

      setStatus({ loading: false, error: '' });
    };

    loadProjects();
  }, []);

  return (
    <section className={styles.projects}>
      <Reveal>
        <SectionHeading
          eyebrow="Selected Work"
          title="Real builds, not placeholder case studies."
          description="Projects stream in from Firestore so the portfolio stays easy to update without touching code."
        />
      </Reveal>

      {status.loading ? <div className={styles.feedback}>Loading projects...</div> : null}
      {status.error ? <div className={styles.error}>{status.error}</div> : null}

      {!status.loading && !status.error ? (
        <div className={styles.stack}>
          {projects.length ? (
            projects.map((project, index) => (
              <Reveal key={project.id}>
                <ProjectCard project={project} index={index} />
              </Reveal>
            ))
          ) : (
            <div className={styles.feedback}>
              No projects yet. Add your first one from the admin panel.
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default Projects;
