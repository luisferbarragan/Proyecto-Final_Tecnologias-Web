import { forwardRef } from 'react'
import { useCV } from '../context/CVContext'

const CVPreview = forwardRef(function CVPreview(_, ref) {
  const { cvData } = useCV()
  const { personalInfo, skills, projects, education } = cvData

  return (
    <article ref={ref} className="editor-card preview-card">
      <div className="preview-header">
        {personalInfo.profileImage ? (
          <img
            className="preview-avatar"
            src={personalInfo.profileImage}
            alt={`Foto de ${personalInfo.fullName || 'perfil'}`}
          />
        ) : (
          <div className="preview-avatar preview-avatar--empty">CV</div>
        )}

        <div>
          <h2>{personalInfo.fullName || 'Nombre completo'}</h2>
          <p>{personalInfo.profession || 'Profesión'}</p>
          <p>{personalInfo.city || 'Ciudad'}</p>
        </div>
      </div>

      <div className="preview-grid">
        <div>
          <h3>Contacto</h3>
          <p>{personalInfo.email || 'Correo'}</p>
          <p>{personalInfo.phone || 'Teléfono'}</p>
        </div>

        <div>
          <h3>Enlaces profesionales</h3>

          {personalInfo.github ? (
            <p>
              <a href={personalInfo.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </p>
          ) : (
            <p>GitHub</p>
          )}

          {personalInfo.linkedin ? (
            <p>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </p>
          ) : (
            <p>LinkedIn</p>
          )}

          {personalInfo.portfolio ? (
            <p>
              <a href={personalInfo.portfolio} target="_blank" rel="noreferrer">
                Portafolio
              </a>
            </p>
          ) : (
            <p>Portafolio</p>
          )}
        </div>
      </div>

      <div>
        <h3>Perfil</h3>
        <p className="preview-profile-text">
          {personalInfo.profile ||
            'Todavía no has escrito una descripción profesional.'}
        </p>
      </div>

      <div>
        <h3>Habilidades</h3>

        {skills.length > 0 ? (
          <div className="preview-list">
            {skills.map((skill, index) => (
              <div className="preview-item" key={skill.id || index}>
                <strong>{skill.name || skill.skill}</strong>
                {skill.category && <p>Categoría: {skill.category}</p>}
                {skill.level && <p>Nivel: {skill.level}</p>}
                {skill.description && <p>{skill.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p>No hay habilidades registradas.</p>
        )}
      </div>

      <div>
        <h3>Proyectos</h3>

        {projects.length > 0 ? (
          <div className="preview-list">
            {projects.map((project) => (
              <div className="preview-item" key={project.id}>
                <strong>{project.name}</strong>
                <p>{project.description}</p>
                <p>Tecnologías: {project.technologies}</p>

                {project.repository && (
                  <p>
                    <a href={project.repository} target="_blank" rel="noreferrer">
                      Ver repositorio
                    </a>
                  </p>
                )}

                {project.deploy && (
                  <p>
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
              </div>
            ))}
          </div>
        ) : (
          <p>No hay proyectos registrados.</p>
        )}
      </div>

      <div>
        <h3>Educación</h3>

        {education.length > 0 ? (
          <div className="preview-list">
            {education.map((entry, index) => (
              <div className="preview-item" key={entry.id || index}>
                <strong>{entry.program}</strong>
                <p>{entry.institution}</p>
                <p>{entry.period}</p>
                <p>{entry.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay registros educativos.</p>
        )}
      </div>
    </article>
  )
})

export default CVPreview