import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import { getResumeContent } from '../firebase/content';
import styles from './Resume.module.css';

const dataUrlToBlobUrl = async (dataUrl) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

function Resume() {
  const [resumeUrl, setResumeUrl] = useState('');
  const [viewUrl, setViewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [status, setStatus] = useState({
    loading: true,
    error: ''
  });

  useEffect(() => {
    const loadResume = async () => {
      try {
        setStatus({ loading: true, error: '' });
        const content = await getResumeContent();

        if (!content.resumeUrl) {
          setStatus({
            loading: false,
            error: 'Resume not available yet. Save a public PDF URL from the admin dashboard.'
          });
          return;
        }

        setResumeUrl(content.resumeUrl);
        setStatus({ loading: false, error: '' });
      } catch (error) {
        setStatus({
          loading: false,
          error: 'Resume not available right now. Check Firestore setup and try again.'
        });
      }
    };

    loadResume();
  }, []);

  useEffect(() => {
    let objectUrl = '';

    const prepareResumeUrl = async () => {
      if (!resumeUrl) {
        setViewUrl('');
        return;
      }

      if (!resumeUrl.startsWith('data:application/pdf')) {
        setViewUrl(resumeUrl);
        return;
      }

      try {
        objectUrl = await dataUrlToBlobUrl(resumeUrl);
        setViewUrl(objectUrl);
      } catch (error) {
        setViewUrl(resumeUrl);
      }
    };

    prepareResumeUrl();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [resumeUrl]);

  return (
    <section className={styles.resume}>
      <Reveal>
        <SectionHeading
          eyebrow="Resume"
          title="A direct snapshot of experience, linked from Firestore."
          description="The resume URL is loaded from Firestore so you can update it without redeploying the site."
        />
      </Reveal>

      <Reveal className={styles.card}>
        {status.loading ? <p className={styles.message}>Loading resume...</p> : null}
        {status.error ? <p className={styles.message}>{status.error}</p> : null}

        {!status.loading && viewUrl ? (
          <>
            <div className={styles.actions}>
              <a href={viewUrl} target="_blank" rel="noreferrer" className={styles.primaryBtn}>
                View Resume
              </a>
              <a href={viewUrl} download className={styles.secondaryBtn}>
                Download PDF
              </a>
              <button
                type="button"
                className={styles.previewBtn}
                onClick={() => setShowPreview((currentValue) => !currentValue)}
              >
                {showPreview ? 'Hide Preview' : 'Load Preview'}
              </button>
            </div>

            {showPreview ? (
              <div className={styles.previewWrap}>
                <iframe title="Resume Preview" src={viewUrl} className={styles.preview} loading="lazy" />
              </div>
            ) : null}
          </>
        ) : null}
      </Reveal>
    </section>
  );
}

export default Resume;
