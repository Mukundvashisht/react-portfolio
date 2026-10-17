import { useState } from 'react';
import { validateContact, sendContact, isContactConfigured, getContactAccessKey, CONTACT_ENDPOINT, THANK_YOU_URL } from '../utils/contact.js';
import '../Styles/Contact.css';

const blank = { name: '', email: '', subject: '', message: '', botcheck: '' };

export default function ContactUs() {
  const [values, setValues] = useState(blank);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ kind: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  function update(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: '' }));
    if (status.message) setStatus({ kind: '', message: '' });
  }

  async function submit(event) {
    event.preventDefault();
    if (isSending) return;
    // const validation = validateContact(values);
    const submittedValues = Object.fromEntries(
      ['name', 'email', 'subject', 'message', 'botcheck'].map(
        (name) => [name, String(new FormData(event.currentTarget).get(name) ?? '')],
      ),
    );

    setValues(submittedValues);
    const validation = validateContact(submittedValues);

    setErrors(validation);
    if (Object.keys(validation).length) {
      setStatus({ kind: 'error', message: 'Please correct the highlighted fields.' });
      return;
    }
    // if (values.botcheck) return; // Spam trap: never forward bot-filled submissions

    if (submittedValues.botcheck) {
      setStatus({
        kind: 'error',
        message: 'The spam check blocked this submission. Please reload and try again, or email me directly.',
      });
      return;
    }

    if (!isContactConfigured()) {
      setStatus({ kind: 'error', message: 'This contact form is not configured yet: add your Web3Forms access key (see README.md).' });
      return;
    }

    setIsSending(true);
    setStatus({ kind: '', message: '' });
    try {

      // await sendContact(values);
      
      await sendContact(submittedValues);

      setValues(blank);
      setErrors({});
      setStatus({ kind: 'success', message: 'Message sent! Thank you — I’ll get back to you soon.' });
    } catch {
      setStatus({ kind: 'error', message: 'Your message could not be sent. Please email me directly using the link on this page.' });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="contact_section section-wrap" id="contact" aria-labelledby="contact-heading">
      <div className="section-top">
        <p className="eyebrow">Get in touch</p>
        <h2 className="section-heading" id="contact-heading">Let’s work together</h2>
        <p className="section-subtitle">Have a role, freelance project, or collaboration in mind? Send a message or reach out directly.</p>
      </div>
      <div className="contact-layout">
        <div className="contact-details">
          <h3>Contact details</h3>
          <p>I’m open to frontend, WordPress and Shopify development opportunities.</p>
          <a href="mailto:work.mukund.vashisht@gmail.com"><span aria-hidden="true"><img src="/assets/email-icon.png" alt="Email" width="20" height="20" /></span> work.mukund.vashisht@gmail.com</a>
          <a href="tel:+919992111946"><span aria-hidden="true"><img src="/assets/call-icon.png" alt="Call" width="20" height="20" /></span> +91 99921 11946</a>
          <a href="https://www.linkedin.com/in/mukund-vashisht" target="_blank" rel="noopener noreferrer"><span aria-hidden="true"><img src="/assets/linkedin-icon.png" alt="LinkedIn" width="20" height="20" /></span> LinkedIn</a>
          <a href="https://github.com/Mukundvashisht" target="_blank" rel="noopener noreferrer"><span aria-hidden="true"><img src="/assets/github-logo.webp" alt="GitHub" width="25" height="25" /></span> GitHub</a>
        </div>
        {/* action/method/access_key give a no-JavaScript fallback: the browser posts
            natively to Web3Forms, which redirects back via the redirect field. */}
        <form className="contact-form" action={CONTACT_ENDPOINT} method="POST" onSubmit={submit} noValidate>
          <input type="hidden" name="access_key" value={getContactAccessKey()} />
          <input type="hidden" name="redirect" value={THANK_YOU_URL} />
          {/* <div className="honeypot-field" aria-hidden="true">
            <label htmlFor="botcheck">Do not fill this field</label>
            <input id="botcheck" type="text" name="botcheck" tabIndex={-1} autoComplete="off" value={values.botcheck} onChange={update} />
          </div> */}
          <input
            id="botcheck"
            type="checkbox"
            name="botcheck"
            hidden
            tabIndex={-1}
            autoComplete="off"
          />
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="contact-name">Name <span aria-hidden="true">*</span></label>
              <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={100} required value={values.name} onChange={update} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} placeholder="Your name" />
              {errors.name && <span className="field-error" id="contact-name-error">{errors.name}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email <span aria-hidden="true">*</span></label>
              <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required value={values.email} onChange={update} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} placeholder="you@example.com" />
              {errors.email && <span className="field-error" id="contact-email-error">{errors.email}</span>}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="contact-subject">Subject <span className="optional">(optional)</span></label>
            <input id="contact-subject" name="subject" type="text" maxLength={140} value={values.subject} onChange={update} placeholder="Job opportunity / Project enquiry" />
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">Message <span aria-hidden="true">*</span></label>
            <textarea id="contact-message" name="message" rows={5} minLength={10} maxLength={5000} required value={values.message} onChange={update} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} placeholder="Tell me a little about what you have in mind…" />
            {errors.message && <span className="field-error" id="contact-message-error">{errors.message}</span>}
          </div>
          <button type="submit" className="primary-button" disabled={isSending} aria-busy={isSending}>
            {isSending ? 'Sending…' : 'Send message'}{' '}
            {isSending ? <span className="button-spinner" aria-hidden="true" /> : <span aria-hidden="true">→</span>}
          </button>
          <p className="form-note">Fields marked * are required. You can also email me directly.</p>
          <p role="status" aria-live="polite" className={`form-status ${status.kind}`}>{status.message || (isSending ? 'Sending your message…' : '')}</p>
        </form>
      </div>
    </section>
  );
}
