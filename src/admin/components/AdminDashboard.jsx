import { useEffect, useState } from 'react';
import ProjectForm from './ProjectForm';
import ResumeUpload from './ResumeUpload';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject
} from '../../firebase/projects';
import styles from './AdminDashboard.module.css';

const MAX_IMAGE_SIZE = 350 * 1024;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState({
    loading: true,
    saving: false,
    error: '',
    message: ''
  });

  const loadProjects = async () => {
    try {
      setStatus((currentStatus) => ({
        ...currentStatus,
        loading: true,
        error: '',
        message: ''
      }));
      const data = await getProjects();
      setProjects(data);
      setStatus((currentStatus) => ({
        ...currentStatus,
        loading: false,
        error: ''
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        loading: false,
        error: 'Unable to load projects from Firestore.',
        message: ''
      }));
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectSubmit = async (formValues) => {
    try {
      setStatus((currentStatus) => ({
        ...currentStatus,
        saving: true,
        error: '',
        message: ''
      }));

      if (!imageFile && !editingProject) {
        throw new Error('Please select an image file.');
      }

      const nextValues = { ...formValues };

      if (imageFile) {
        if (imageFile.size > MAX_IMAGE_SIZE) {
          throw new Error('Image file is too large.');
        }

        nextValues.imageUrl = await readFileAsDataUrl(imageFile);
      }

      if (editingProject) {
        await updateProject(editingProject.id, nextValues);
        setStatus((currentStatus) => ({
          ...currentStatus,
          message: 'Project updated successfully.'
        }));
      } else {
        await createProject(nextValues);
        setStatus((currentStatus) => ({
          ...currentStatus,
          message: 'Project added successfully.'
        }));
      }

      setEditingProject(null);
      setImageFile(null);
      await loadProjects();
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        saving: false,
        error:
          error.message === 'Image file is too large.'
            ? 'Image too large for Firestore. Keep it under 350 KB.'
            : error.message === 'Please select an image file.'
            ? 'Please select an image file to upload.'
            : 'Saving failed. Check your Firestore rules and field values.',
        message: ''
      }));
      return;
    }

    setStatus((currentStatus) => ({
      ...currentStatus,
      saving: false
    }));
  };

  const handleDelete = async (project) => {
    try {
      setStatus((currentStatus) => ({
        ...currentStatus,
        error: '',
        message: ''
      }));

      await deleteProject(project.id);
      await loadProjects();

      setStatus((currentStatus) => ({
        ...currentStatus,
        message: 'Project deleted successfully.'
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        error: 'Delete failed. Please try again.',
        message: ''
      }));
    }
  };

  return (
    <div className={styles.dashboard}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>{editingProject ? 'Edit Project' : 'Add Project'}</h2>
          <p>Upload an image file for the project.</p>
        </div>

        <ProjectForm
          initialValues={editingProject}
          onSubmit={handleProjectSubmit}
          onCancel={() => setEditingProject(null)}
          loading={status.saving}
          selectedFile={imageFile}
          onFileChange={setImageFile}
        />

        {status.message ? <p className={styles.message}>{status.message}</p> : null}
        {status.error ? <p className={styles.error}>{status.error}</p> : null}
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Existing Projects</h2>
          <p>Edit in place or remove records directly from Firestore.</p>
        </div>

        {status.loading ? <p className={styles.info}>Loading projects...</p> : null}
        {!status.loading && !projects.length ? (
          <p className={styles.info}>No projects found yet.</p>
        ) : null}

        <div className={styles.projectList}>
          {projects.map((project) => (
            <article key={project.id} className={styles.projectRow}>
              <div>
                <strong>{project.title}</strong>
                <p>{project.description}</p>
              </div>

              <div className={styles.rowActions}>
                <button type="button" onClick={() => setEditingProject(project)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(project)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ResumeUpload />
    </div>
  );
}

export default AdminDashboard;
