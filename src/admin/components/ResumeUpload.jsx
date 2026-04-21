import { useState } from 'react';
import { clearResumeContent, updateResumeContent } from '../../firebase/content';
import styles from './ResumeUpload.module.css';

const MAX_RESUME_SIZE = 700 * 1024;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });

function ResumeUpload() {
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState({
    loading: false,
    message: '',
    error: ''
  });

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!resumeFile) {
      setStatus({
        loading: false,
        message: '',
        error: 'Please choose a PDF file before saving.'
      });
      return;
    }

    try {
      setStatus({ loading: true, message: '', error: '' });

      if (resumeFile.size > MAX_RESUME_SIZE) {
        throw new Error('Resume file is too large.');
      }

      const nextResumeUrl = await readFileAsDataUrl(resumeFile);
      const nextResumeName = resumeFile.name;

      await updateResumeContent({
        resumeUrl: nextResumeUrl,
        resumeName: nextResumeName
      });

      setStatus({
        loading: false,
        message: 'Resume file uploaded to Firestore.',
        error: ''
      });
      setResumeFile(null);
    } catch (error) {
      setStatus({
        loading: false,
        message: '',
        error:
          error.message === 'Resume file is too large.'
            ? 'PDF too large for Firestore. Keep it under 700 KB.'
            : 'Resume save failed. Please try again.'
      });
    }
  };

  const handleDelete = async () => {
    try {
      setStatus({ loading: true, message: '', error: '' });
      await clearResumeContent();
      setResumeFile(null);
      setStatus({
        loading: false,
        message: 'Resume cleared successfully.',
        error: ''
      });
    } catch (error) {
      setStatus({
        loading: false,
        message: '',
        error: 'Could not delete the resume right now.'
      });
    }
  };

  return (
    <div className={styles.card}>
      <div>
        <h3>Resume PDF</h3>
        <p>Upload a small PDF file directly to Firestore.</p>
      </div>

      <form className={styles.form} onSubmit={handleUpload}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
          required
        />
        <p className={styles.note}>Direct Firestore upload works best for PDFs under 700 KB.</p>
        <button type="submit" disabled={status.loading}>
          {status.loading ? 'Saving...' : 'Upload Resume'}
        </button>
        <button type="button" className={styles.ghostBtn} onClick={handleDelete} disabled={status.loading}>
          Delete Resume
        </button>
      </form>

      {status.message ? <p className={styles.message}>{status.message}</p> : null}
      {status.error ? <p className={styles.error}>{status.error}</p> : null}
    </div>
  );
}

export default ResumeUpload;
