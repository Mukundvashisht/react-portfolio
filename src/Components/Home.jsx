import Header from './Header';
import ContactUs from './ContactUs';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects.js';
import { experiences, skillGroups } from '../data/profile.js';
import '../Styles/Home.css';
import { useEffect, useState } from 'react';



export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />
      <main id="main-content">
        <section className="hero section-wrap" id="home" aria-labelledby="hero-heading">
          <div className="hero-content">
            <p className="hero-name">MUKUND VASHISHT</p>
            <p className="eyebrow"><span className="available-dot" aria-hidden="true" /> Available for opportunities</p>
            <h1 id="hero-heading">Building websites that <span>work beautifully.</span></h1>
            <p className="hero-role">Frontend / Web Developer <span aria-hidden="true">·</span> WordPress <span aria-hidden="true">·</span> Shopify <span aria-hidden="true">·</span> Wix</p>
            <p className="hero-description">I develop and maintain responsive websites and e-commerce experiences, from custom frontend sections to Shopify and WordPress integrations. I also explore backend development with Python, Flask and PostgreSQL.</p>
            <div className="hero-buttons">
              <a className="primary-button" href="#projects">Explore my work <span aria-hidden="true">↗</span></a>
              <a className="secondary-button" href="/assets/Mukund_Vashisht_Resume.pdf" download>Download resume <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-highlights" aria-label="Development specialties">
              <span>Responsive websites</span><span>CMS customization</span><span>E-commerce</span>
            </div>
          </div>
        </section>

        <section className="experience-section section-wrap" id="experience" aria-labelledby="experience-heading">
          <div className="section-top">
            <p className="eyebrow">Career</p>
            <h2 className="section-heading" id="experience-heading">Professional experience</h2>
          </div>
          <p className="section-subtitle experience-intro">Hands-on delivery for client-facing websites, from responsive interfaces and e-commerce configuration to maintenance and integrations.</p>
          <div className="experience-grid">
            {experiences.map((experience) => (
              <article className="experience-card" key={experience.company}>
                <p className="experience-period">{experience.period}</p>
                <h3>{experience.role}</h3>
                <p className="experience-company">{experience.company}</p>
                <ul className="experience-highlights">
                  {experience.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
                <div className="experience-tags" aria-label={`${experience.company} technology focus`}>
                  {experience.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="skills-section section-wrap" id="skills" aria-labelledby="skills-heading">
          <div className="section-top">
            <p className="eyebrow">What I use</p>
            <h2 className="section-heading" id="skills-heading">Technical skills</h2>
            <p className="section-subtitle">A more complete look at the frameworks, platforms, tools and practices from my professional and independent work.</p>
          </div>
          <div className="skill-grid">
            {skillGroups.map((group) => <article className="skill-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>)}
          </div>
        </section>

        <section className="projects-section section-wrap" id="projects" aria-labelledby="projects-heading">
          <div className="section-top">
            <p className="eyebrow">Selected work</p>
            <h2 className="section-heading" id="projects-heading">Projects</h2>
            <p className="section-subtitle">Client work and personal builds, with a short description of my contribution to each project. Open a card to view the website.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => <ProjectCard key={project.url} {...project} />)}
          </div>
        </section>

        <ContactUs />
      </main>
      <footer className="site-footer">
        {/* <div className="section-wrap footer-inner"><span>© {new Date().getFullYear()} Portfolio. Built with React.</span><a class="back_to_top" href="#home">Back to top ↑</a></div> */}
        <div className="section-wrap footer-inner">
          <span>© {new Date().getFullYear()} Portfolio. Built with React.</span>
          <a 
            class="back_to_top" 
            href="#home"
            aria-label="Back to top"
            aria-hidden={!showBackToTop}
            tabIndex={showBackToTop ? 0 : -1}
          >
            <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z" fill="#ffffff"/>
            </svg>
          </a>
        </div>
      </footer>
    </>
  );
}
