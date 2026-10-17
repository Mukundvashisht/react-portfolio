// Contact delivery uses Web3Forms.com: a free form-to-email service
// (250 submissions/month free, no backend code).
// Submissions are POSTed as JSON to https://api.web3forms.com/submit and
// Web3Forms forwards them to the inbox tied to the access key.
//
// SETUP: the access key is public by design (an alias for your email, not a
// secret). Get one free at https://web3forms.com — verify your email, copy the
// key, then EITHER paste it below in place of YOUR_ACCESS_KEY_HERE, OR create
// a .env file with VITE_WEB3FORMS_ACCESS_KEY=your_key and rebuild.
export const CONTACT_ENDPOINT = 'https://api.web3forms.com/submit';
export const THANK_YOU_URL = 'https://mukund-vashisht.netlify.app/#contact';

// Fallback slot: you may alternatively paste the key directly below.
const PLACEHOLDER_KEY = 'YOUR_ACCESS_KEY_HERE';

export function getContactAccessKey() {
  return (import.meta.env?.VITE_WEB3FORMS_ACCESS_KEY || PLACEHOLDER_KEY).trim();
}

export function isContactConfigured() {
  const key = getContactAccessKey();
  return key.length > 0 && key !== PLACEHOLDER_KEY;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact({ name = '', email = '', message = '' }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Please enter your name.';
  else if (name.trim().length > 100) errors.name = 'Please use 100 characters or fewer.';
  if (!email.trim()) errors.email = 'Please enter your email address.';
  else if (email.trim().length > 254 || !emailPattern.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (!message.trim()) errors.message = 'Please enter your message.';
  else if (message.trim().length < 10) errors.message = 'Please include at least 10 characters.';
  else if (message.trim().length > 5000) errors.message = 'Please keep your message under 5,000 characters.';
  return errors;
}

/** Build the JSON payload Web3Forms forwards as an email. */
export function contactPayload(values = {}, accessKey = getContactAccessKey()) {
  const { name = '', email = '', subject = '', message = '' } = values;
  return {
    access_key: accessKey,
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim() ? subject.trim() : 'New portfolio message',
    message: message.trim(),
    // redirect: THANK_YOU_URL,
    botcheck: false,
  };
}

/** Submit a verified contact inquiry; resolves true only when Web3Forms accepts it. */
export async function sendContact(values, options = {}) {
  const { fetchImpl = fetch, accessKey = getContactAccessKey() } = options;
  if (!accessKey || accessKey === PLACEHOLDER_KEY) {
    throw new Error('Web3Forms access key is not configured yet.');
  }
  const response = await fetchImpl(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(contactPayload(values, accessKey)),
  });
  const data = await response.json().catch(() => ({}));
  // Web3Forms answers {"success": true|false, "message": "..."} (booleans).
  if (!response.ok || data.success !== true) {
    throw new Error(data.message || 'Contact submission was rejected');
  }
  return true;
}
