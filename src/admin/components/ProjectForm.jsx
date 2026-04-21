import { useEffect, useState } from 'react';
import styles from './ProjectForm.module.css';

const emptyForm = {
  title: '',
  description: '',
  techStack: '',
  githubLink: '',
  liveLink: '',
  imageUrl: '',
  featured: false,
  accent: 'sun'
};

function ProjectForm({ initialValues, onSubmit, onCancel, loading, selectedFile, onFileChange }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...initialValues,
        techStack: Array.isArray(initialValues.techStack)
          ? initialValues.techStack.join(', ')
          : initialValues.techStack || ''
      });
      return;
    }

    setForm(emptyForm);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <label>
          Title
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Accent
          <select name="accent" value={form.accent} onChange={handleChange}>
            <option value="sun">Sun</option>
            <option value="sky">Sky</option>
            <option value="mint">Mint</option>
          </select>
        </label>
      </div>

      <label>
        Description
        <textarea
          rows="4"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Tech Stack
        <input
          type="text"
          name="techStack"
          value={form.techStack}
          onChange={handleChange}
          placeholder="React, Firebase, CSS Modules"
          required
        />
      </label>

      <div className={styles.grid}>
        <label>
          GitHub Link
          <input
            type="url"
            name="githubLink"
            value={form.githubLink}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Live Link
          <input type="url" name="liveLink" value={form.liveLink} onChange={handleChange} required />
        </label>
      </div>

      <label>
        Upload Image
        <input type="file" accept="image/*" onChange={(event) => onFileChange(event.target.files?.[0] || null)} required />
        <span className={styles.helperText}>
          Firestore upload works best for images under 350 KB.
          {selectedFile ? ` Selected: ${selectedFile.name}` : ''}
        </span>
      </label>

      <label className={styles.checkbox}>
        <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
        Feature this project
      </label>

      <div className={styles.actions}>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialValues ? 'Update Project' : 'Add Project'}
        </button>
        {initialValues ? (
          <button type="button" className={styles.ghostBtn} onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default ProjectForm;
