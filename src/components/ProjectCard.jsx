function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <article className="project-card">
      <h4>{project.name}</h4>

      <p>{project.description}</p>

      <p>
        <strong>Tecnologías:</strong> {project.technologies}
      </p>

      {project.repository && (
        <p>
          <strong>Repositorio:</strong>{' '}
          <a href={project.repository} target="_blank" rel="noreferrer">
            Ver repositorio
          </a>
        </p>
      )}

      {project.deploy && (
        <p>
          <strong>Deploy:</strong>{' '}
          <a href={project.deploy} target="_blank" rel="noreferrer">
            Ver proyecto
          </a>
        </p>
      )}

      {project.image && (
        <img
          className="project-image"
          src={project.image}
          alt={`Captura de ${project.name}`}
        />
      )}

      <div className="project-actions">
        <button type="button" onClick={() => onEdit(project)}>
          Editar
        </button>

        <button type="button" onClick={() => onDelete(project.id)}>
          Eliminar
        </button>
      </div>
    </article>
  )
}

export default ProjectCard