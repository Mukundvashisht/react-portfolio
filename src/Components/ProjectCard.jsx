import '../Styles/Projectcard.css';

export default function ProjectCard({ name, image, url, technologies, description, badge }) {
  return (
    <article className="project-card">
      <a className="project-card-link" href={url} target="_blank" rel="noopener noreferrer" aria-label={`View ${name} website (opens in a new tab)`}>
        <div className="project-thumb">
          <img src={image} alt={`${name} website screenshot`} loading="lazy" decoding="async" width="640" height="420" />
          <span className="external-arrow" aria-hidden="true">↗</span>
        </div>
        <div className="project-info">
          <h3>{name}
            {badge !== '' && (
              <span className="project-badge">{badge}</span>
            )}
          </h3>
          <p className="project-tech">{technologies}</p>
          <p className="project-description">{description}</p>
          <span className="project-action">Visit project <span aria-hidden="true">↗</span></span>
        </div>
      </a>
    </article>
  );
}
