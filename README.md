# Web Developer Portfolio — React + Vite

A responsive React + Vite portfolio showcasing frontend, WordPress, Shopify and other web development work. Updated with:

- Centered hero and calls to action, expanded professional experience based on the October 2026 resume, and all resume skill areas
- Responsive, keyboard-friendly navigation and light/dark theme preference
- Accessible project cards with visible descriptions and optimized WebP screenshots
- SEO title/description/social metadata and reduced-motion support
- A working **contact form** (FormSubmit.co email delivery) with validation, honeypot, error feedback and a no-JavaScript fallback
- Latest uploaded October 2026 PDF resume at `public/assets/Mukund_Vashisht_Resume.pdf`

## Development

```bash
npm ci
npm run dev
```

Other commands:

```bash
npm run lint
npm test
npm run build
npm run preview
```

**Node.js 20 or later** recommended. `dist/` is the compiled static site, included for convenient manual Netlify deployment.

## Add your own project entries

You said you'll add your new client projects yourself, so the 13 original projects have been preserved. All cards are defined in **`src/data/projects.js`**. Add another object there:

```js
{
  name: 'Example Site',
  image: '/assets/example.webp',
  url: 'https://example.com/',
  technologies: 'Shopify · Custom Liquid sections',
  description: 'A short, accurate summary of your personal contribution to this project.'
},
```

Put your image in `public/assets/example.webp`. Screenshots display at an approximately 1.7:1 ratio; use 1000 px wide or less to keep the page fast. Each card now shows a short description in the previously unused space. The original 13 cards remain. Write descriptions that accurately reflect your own contribution rather than implying full-site ownership.

## IMPORTANT: Activate the contact form and email delivery

Contact delivery uses **[Web3Forms](https://web3forms.com/)**, a free form-to-email service (250 submissions/month free, forever): submissions are POSTed as JSON to `https://api.web3forms.com/submit` and Web3Forms forwards them to the inbox tied to your access key. It works on any static host (Netlify, GitHub Pages, etc.) with no backend code.

**Setup (about two minutes, one time):**

1. Go to [web3forms.com](https://web3forms.com), enter **`work.mukund.vashisht@gmail.com`** and verify the confirmation email they send you.
2. Copy the access key they show you. It is **public by design** (an alias for your email, not a secret) and is safe to keep in client-side code.
3. Put the key in the project, either way works:
   - create a `.env` file containing `VITE_WEB3FORMS_ACCESS_KEY=your_key_here` and rebuild (`npm run build`), or
   - paste the key in place of `YOUR_ACCESS_KEY_HERE` in `src/utils/contact.js`.
4. Redeploy and submit the form once. Unlike FormSubmit, there is **no activation email to click** — the key works immediately. Confirm the message arrives in your inbox (check spam initially).

Until the key is configured, the form shows a clear "not configured yet" message instead of pretending to send.

The form collects name, email, optional subject and message. The subject (or a default) becomes the notification email's subject line, and the visitor's email is set as Reply-To so you can reply directly. A honeypot field drops obvious bots, and the form also works without JavaScript via a native POST fallback (visitors are redirected back via the `redirect` field). If you ever outgrow the service, `sendContact` in `src/utils/contact.js` is the single place to change providers. Direct `mailto:` contact links will always work.

## Where to edit things

| Item | File |
|---|---|
| Homepage sections and hero copy | `src/Components/Home.jsx` |
| Experience entries and all resume skill groups | `src/data/profile.js` |
| Existing/new projects | `src/data/projects.js` |
| Contact UI/behavior | `src/Components/ContactUs.jsx` |
| Contact validation/submission | `src/utils/contact.js` |
| Contact endpoint / email service | `src/utils/contact.js` |
| Navigation and theme | `src/Components/Header.jsx` |
| Visual styles | `src/App.css`, `src/Styles/*.css` |
| SEO meta tags | `index.html` |
| Downloadable resume | `public/assets/Mukund_Vashisht_Resume.pdf` |

## Notes

- A successful `npm run build` or `npm test` does not prove email delivery: that depends on a real Web3Forms access key and a real deployed test.
- The portfolio is client-rendered. For stricter SEO requirements, consider static prerendering later, but this project already has usable site metadata.
