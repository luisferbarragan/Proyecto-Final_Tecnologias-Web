import { useState } from 'react'
import { useCV } from '../context/CVContext'
import ProjectCard from './ProjectCard'

function ProjectForm() {
  const {
    cvData,
    addProject,
    updateProject,
    deleteProject,
  } = useCV()

  const { projects } = cvData

  const [editingProjectId, setEditingProjectId] = useState(null)

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

    if (editingProjectId) {
      updateProject(editingProjectId, projectData)
      setEditingProjectId(null)
    } else {
      const newProject = {
        id: Date.now(),
        ...projectData,
      }

      addProject(newProject)
    }

    setProjectData({
      name: '',
      description: '',
      technologies: '',
      repository: '',
      deploy: '',
      image: '',
    })
  }

  const handleEdit = (project) => {
    setEditingProjectId(project.id)

    setProjectData({
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      repository: project.repository,
      deploy: project.deploy,
      image: project.image,
    })
  }

  return (
    <section className="editor-card editor-form">
      <h2>Proyectos</h2>

      <p>
        Agrega proyectos profesionales, escolares o personales
        para mostrarlos en tu CV.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="editor-grid">
          <label className="field">
            <span className="field-label">
              Nombre del proyecto
            </span>

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
            <span className="field-label">
              Tecnologías utilizadas
            </span>

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
            <span className="field-label">
              Descripción
            </span>

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
            <span className="field-label">
              Repositorio
            </span>

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
            <span className="field-label">
              Deploy
            </span>

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
            <span className="field-label">
              Imagen o captura
            </span>

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
          {editingProjectId
            ? 'Actualizar proyecto'
            : 'Agregar proyecto'}
        </button>
      </form>

      <div className="editor-section">
        <h3>Proyectos registrados</h3>

        {projects.length === 0 ? (
          <p>No hay proyectos registrados todavía.</p>
        ) : (
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={deleteProject}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectForm