import { useState } from 'react'
import { useCV } from '../context/CVContext'

function ProjectForm() {
  const { cvData, addProject } = useCV()
  const { projects } = cvData

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    technologies: '',
    repository: '',
    deploy: '',
    image: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const newProject = {
      id: Date.now(),
      ...projectData,
    }

    addProject(newProject)

    setProjectData({
      name: '',
      description: '',
      technologies: '',
      repository: '',
      deploy: '',
      image: '',
    })
  }

  return (
    <section className="editor-card editor-form">
      <h2>Proyectos</h2>
      <p>Agrega proyectos profesionales, escolares o personales para mostrarlos en tu CV.</p>

      <form onSubmit={handleSubmit}>
        <div className="editor-grid">
          <label className="field">
            <span className="field-label">Nombre del proyecto</span>
            <input
              className="field-input"
              type="text"
              name="name"
              value={projectData.name}
              onChange={handleChange}
              placeholder="Ej. Sistema de inventario"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Tecnologías utilizadas</span>
            <input
              className="field-input"
              type="text"
              name="technologies"
              value={projectData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              required
            />
          </label>

          <label className="field field--full">
            <span className="field-label">Descripción</span>
            <textarea
              className="field-input field-textarea"
              name="description"
              value={projectData.description}
              onChange={handleChange}
              placeholder="Describe brevemente el objetivo y funcionamiento del proyecto."
              rows="4"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Repositorio</span>
            <input
              className="field-input"
              type="url"
              name="repository"
              value={projectData.repository}
              onChange={handleChange}
              placeholder="https://github.com/usuario/proyecto"
            />
          </label>

          <label className="field">
            <span className="field-label">Deploy</span>
            <input
              className="field-input"
              type="url"
              name="deploy"
              value={projectData.deploy}
              onChange={handleChange}
              placeholder="https://mi-proyecto.vercel.app"
            />
          </label>

          <label className="field field--full">
            <span className="field-label">Imagen o captura</span>
            <input
              className="field-input"
              type="url"
              name="image"
              value={projectData.image}
              onChange={handleChange}
              placeholder="https://ejemplo.com/captura.jpg"
            />
          </label>
        </div>

        <button className="primary-button" type="submit">
          Agregar proyecto
        </button>
      </form>

      <div className="editor-section">
        <h3>Proyectos registrados</h3>

        {projects.length === 0 ? (
          <p>No hay proyectos registrados todavía.</p>
        ) : (
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
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
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectForm