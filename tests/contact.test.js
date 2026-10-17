import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContact, contactPayload, sendContact, CONTACT_ENDPOINT, isContactConfigured } from '../src/utils/contact.js';

const valid = { name: '  Candidate ', email: '  candidate@example.com ', subject: ' Work opportunity ', message: ' Can we discuss a project? ' };

test('validates a complete contact inquiry', () => {
  assert.deepEqual(validateContact(valid), {});
});

test('provides field-level errors for invalid contact information', () => {
  const errors = validateContact({ name: ' ', email: 'wrong-email', subject: '', message: ' ' });
  assert.ok(errors.name);
  assert.ok(errors.email);
  assert.ok(errors.message);
});

test('refuses to submit data beyond supported field lengths', () => {
  const errors = validateContact({ ...valid, message: 'a'.repeat(5001) });
  assert.ok(errors.message);
});

test('builds a trimmed Web3Forms payload with the access key and redirect', () => {
  assert.deepEqual(contactPayload(valid, 'test-key'), {
    access_key: 'test-key',
    name: 'Candidate',
    email: 'candidate@example.com',
    subject: 'Work opportunity',
    message: 'Can we discuss a project?',
    redirect: 'https://mukund-vashisht.netlify.app/#contact',
    botcheck: false,
  });
});

test('falls back to a default subject when none is provided', () => {
  assert.equal(contactPayload({ ...valid, subject: '   ' }, 'test-key').subject, 'New portfolio message');
});

test('reports the form as unconfigured when no access key is available', () => {
  assert.equal(isContactConfigured(), false);
});

test('sends JSON data to the Web3Forms endpoint', async () => {
  let request;
  const result = await sendContact(valid, {
    accessKey: 'test-key',
    fetchImpl: async (url, options) => {
      request = { url, options };
      return { ok: true, json: async () => ({ success: true, message: 'Form submitted successfully!' }) };
    },
  });
  assert.equal(result, true);
  assert.equal(request.url, CONTACT_ENDPOINT);
  assert.equal(request.url, 'https://api.web3forms.com/submit');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers['Content-Type'], 'application/json');
  assert.equal(request.options.headers.Accept, 'application/json');
  const body = JSON.parse(request.options.body);
  assert.equal(body.access_key, 'test-key');
  assert.equal(body.name, 'Candidate');
  assert.equal(body.email, 'candidate@example.com');
  assert.equal(body.subject, 'Work opportunity');
});

test('refuses to submit without an access key instead of failing silently', async () => {
  await assert.rejects(sendContact(valid, { fetchImpl: async () => { throw new Error('must not be called'); } }), /not configured/);
});

test('rejects failed HTTP responses instead of falsely reporting success', async () => {
  await assert.rejects(sendContact(valid, { accessKey: 'test-key', fetchImpl: async () => ({ ok: false, json: async () => ({ success: false, message: 'Server error' }) }) }));
});

test('rejects responses Web3Forms marks unsuccessful', async () => {
  await assert.rejects(
    sendContact(valid, { accessKey: 'test-key', fetchImpl: async () => ({ ok: true, json: async () => ({ success: false, message: 'Invalid Access Key' }) }) }),
    /Invalid Access Key/,
  );
});

test('rejects submissions with an unreadable response body', async () => {
  await assert.rejects(sendContact(valid, { accessKey: 'test-key', fetchImpl: async () => ({ ok: true, json: async () => { throw new Error('bad json'); } }) }));
});
