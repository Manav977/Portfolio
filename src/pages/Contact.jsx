import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';
import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import styles from './Contact.module.css';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

function Contact() {
  const formRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState({
    type: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const fieldMap = {
      from_name: 'name',
      from_email: 'email'
    };
    const nextField = fieldMap[name] || name;

    setForm((currentForm) => ({ ...currentForm, [nextField]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setFeedback({
        type: 'error',
        message: 'Fill out all fields before sending.'
      });
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setFeedback({
        type: 'error',
        message: 'EmailJS is not configured yet. Add service, template, and public key in .env.'
      });
      return;
    }

    try {
      setIsSending(true);
      setFeedback({
        type: '',
        message: ''
      });

      await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        {
          publicKey
        }
      );

      setFeedback({
        type: 'success',
        message: 'Message sent successfully. It will arrive in your connected EmailJS inbox.'
      });
      setForm(initialForm);
    } catch (error) {
      const errorText =
        error?.text || error?.message || 'Unknown EmailJS error. Check template fields and allowed origin.';

      setFeedback({
        type: 'error',
        message: `Message send failed: ${errorText}`
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className={styles.contact}>
      <Reveal>
        <SectionHeading
          eyebrow="Contact"
          title="If the brief needs taste and implementation, let's talk."
          description="Use the quick form or reach out directly through the social links."
        />
      </Reveal>

      <div className={styles.layout}>
        <Reveal className={styles.panel}>
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <label>
              Name
              <input type="text" name="from_name" value={form.name} onChange={handleChange} />
            </label>

            <label>
              Email
              <input type="email" name="from_email" value={form.email} onChange={handleChange} />
            </label>

            <label>
              Subject
              <input type="text" name="subject" value={form.subject} onChange={handleChange} />
            </label>

            <label>
              Message
              <textarea name="message" rows="6" value={form.message} onChange={handleChange} />
            </label>

            <input type="hidden" name="reply_to" value={form.email} readOnly />

            <button type="submit" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
            {feedback.message ? (
              <p className={`${styles.feedback} ${feedback.type === 'error' ? styles.error : styles.success}`}>
                {feedback.message}
              </p>
            ) : null}
            {/* <p className={styles.helpText}>
              EmailJS template fields should be: `from_name`, `from_email`, `subject`, `message`,
              `reply_to`.
            </p> */}
          </form>
        </Reveal>

        <Reveal className={styles.linksPanel}>
          <a href="mailto:hello@manav.studio">hello@manav.studio</a>
          <a href="https://github.com/Manav977?tab=repositories" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.instagram.com/manav_nasra/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://wa.me/919041503569" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default Contact;
