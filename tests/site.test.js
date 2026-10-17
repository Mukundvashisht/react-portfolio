import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { projects } from '../src/data/projects.js';

const contactSource = readFileSync(new URL('../src/Components/ContactUs.jsx', import.meta.url), 'utf8');
const contactUtil = readFileSync(new URL('../src/utils/contact.js', import.meta.url), 'utf8');

test('preserves the complete portfolio project listings', () => {
  assert.equal(projects.length, 19);
  for (const project of projects) {
    assert.match(project.url, /^https:\/\//);
    assert.ok(project.name && project.technologies);
    assert.ok(existsSync(new URL(`../public${project.image}`, import.meta.url)), `${project.name} image must exist`);
  }
});

test('contact form submits through Web3Forms with no Netlify leftovers', () => {
  assert.match(contactUtil, /api\.web3forms\.com\/submit/);
  assert.match(contactUtil, /access_key/);
  assert.match(contactSource, /CONTACT_ENDPOINT/);
  for (const name of ['name', 'email', 'subject', 'message', 'botcheck']) {
    assert.ok(contactSource.includes(`name="${name}"`), `${name} missing from React form`);
  }
  assert.ok(!contactSource.includes('data-netlify'), 'React form must not reference Netlify Forms');
  assert.ok(!contactSource.includes('form-name'), 'React form must not carry the Netlify form-name input');
  assert.ok(!existsSync(new URL('../public/__forms.html', import.meta.url)), 'Netlify blueprint file should be removed');
  assert.ok(!readFileSync(new URL('../index.html', import.meta.url), 'utf8').includes('data-netlify'), 'index.html must not register a Netlify form');
});

test('resume linked in navigation exists in public assets', () => {
  assert.ok(existsSync(new URL('../public/assets/Mukund_Vashisht_Resume.pdf', import.meta.url)));
});
