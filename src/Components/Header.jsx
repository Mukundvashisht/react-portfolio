import { useEffect, useState } from 'react';
import '../Styles/Header.css';

const navigation = [
  // ['#home', 'Home'],
  ['#experience', 'Experience'],
  ['#skills', 'Skills'],
  ['#projects', 'Projects'],
  ['#contact', 'Contact'],
];

function initialTheme() {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch { /* Storage may be blocked */ }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'dark' : 'light';
}

export default function Header() {
  const [theme, setTheme] = useState(initialTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem('theme', theme); } catch { /* Storage may be blocked */ }
  }, [theme]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner section-wrap">
        <a href="#home" className="site-logo" aria-label="Go to homepage" onClick={() => setMenuOpen(false)}>
          <img src="/assets/android-chrome-512x512.png" alt="" width="39" height="39" />
          {/* <span>Portfolio<span className="logo-dot">.</span></span> */}
        </a>
        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} id="site-navigation" aria-label="Main navigation">
          {navigation.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-resume" href="/assets/Mukund_Vashisht_Resume.pdf" download onClick={() => setMenuOpen(false)}>Download resume <span aria-hidden="true">↗</span></a>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((prev) => !prev)} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="site-navigation">
            <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
