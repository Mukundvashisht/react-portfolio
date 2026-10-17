import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { projects } from '../src/data/projects.js';
import { skillGroups, experiences } from '../src/data/profile.js';

const home = readFileSync(new URL('../src/Components/Home.jsx', import.meta.url), 'utf8');
const heroStyles = readFileSync(new URL('../src/Styles/Home.css', import.meta.url), 'utf8');
const card = readFileSync(new URL('../src/Components/ProjectCard.jsx', import.meta.url), 'utf8');

test('portfolio skills reflect the latest uploaded resume across all categories', () => {
  const categories = skillGroups.map(({ title }) => title);
  assert.equal(skillGroups.length, 8);
  for (const expected of ['Frontend technologies', 'E-commerce & CMS', 'Backend technologies', 'Payment platforms', 'Tools & deployment', 'Development practices', 'SEO, performance & accessibility', 'AI, automation & languages']) {
    assert.ok(categories.includes(expected), `Missing category: ${expected}`);
  }
  const skills = skillGroups.flatMap((group) => group.items).join(' / ').toLowerCase();
  for (const expected of ['HTML5', 'CSS3', 'JavaScript', 'React', 'Angular', 'Bootstrap', 'Tailwind CSS', 'Liquid', 'Recharge', 'Metafields', 'Metaobjects', 'WPBakery', 'WooCommerce', 'Python', 'Flask', 'PostgreSQL', 'SQLAlchemy', 'Stripe', 'Razorpay', 'Figma', 'Canva', 'Git', 'Netlify', 'GitHub Pages', 'InfinityFree', 'Render', 'Search Console', 'PageSpeed Insights', 'Lighthouse', 'Core Web Vitals', 'Semantic HTML', 'On-Page SEO', 'Cross-Browser', 'Prompt Engineering', 'Conversational Flow', 'English', 'Hindi']) {
    assert.ok(skills.includes(expected.toLowerCase()), `Missing skill: ${expected}`);
  }
});

test('experience shows meaningful contributions at both employers', () => {
  assert.equal(experiences.length, 2);
  assert.deepEqual(experiences.map((exp) => exp.company), ['Etraffic Webexpert', 'Gsquare Web Tech Pvt Ltd']);
  assert.ok(experiences.every((exp) => exp.responsibilities.length >= 4));
  assert.match(experiences[0].responsibilities.join(' '), /Recharge/);
  assert.match(experiences[0].responsibilities.join(' '), /metafields/i);
  assert.match(experiences[1].responsibilities.join(' '), /7\+/);
  assert.match(home, /experience\.responsibilities\.map/);
});

test('each existing project has a short meaningful card description', () => {
  assert.equal(projects.length, 19);
  for (const project of projects) {
    assert.ok(typeof project.description === 'string' && project.description.length >= 45, `${project.name} needs description`);
    assert.ok(project.description.length <= 180, `${project.name} description too long for card`);
  }
  assert.match(card, /\{description\}/);
});

test('hero text, actions and badges are centered', () => {
  assert.match(heroStyles, /\.hero-content\s*\{[^}]*text-align:\s*center/s);
  assert.match(heroStyles, /\.hero-buttons\s*\{[^}]*justify-content:\s*center/s);
  assert.match(heroStyles, /\.hero-highlights\s*\{[^}]*justify-content:\s*center/s);
});
