import { useState } from 'react'
import { useCV } from '../context/CVContext'
import { validateUrl } from '../utils/validations'
import ProjectCard from './ProjectCard'

const initialProjectData = {
  name: '',
  description: '',
  technologies: '',
  repository: '',
  deploy: '',
  image: '',
}

function ProjectForm() {
  const { cvData, addProject, updateProject, deleteProject } = useCV()
  const { projects } = cvData
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [projectData, setProjectData] = useState(initialProjectData)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
  }

  const validateProject = () => {
    const nextErrors = {}
    const normalizedName = projectData.name.trim()
    const normalizedDescription = projectData.description.trim()
    const normalizedTechnologies = projectData.technologies.trim()
    const normalizedRepository = projectData.repository.trim()
    const normalizedDeploy = projectData.deploy.trim()
    const normalizedImage = projectData.image.trim()

    if (!normalizedName) nextErrors.name = 'Ingresa el nombre del proyecto.'
    if (!normalizedDescription) nextErrors.description = 'Agrega una descripcion.'
    if (!normalizedTechnologies) nextErrors.technologies = 'Ingresa las tecnologias.'
    if (normalizedRepository && !validateUrl(normalizedRepository)) {
      nextErrors.repository = 'Ingresa una URL valida para el repositorio.'
    }
    if (normalizedDeploy && !validateUrl(normalizedDeploy)) {
      nextErrors.deploy = 'Ingresa una URL valida para el deploy.'
    }
    if (normalizedImage && !validateUrl(normalizedImage)) {
      nextErrors.image = 'Ingresa una URL valida para la imagen.'
    }

    const hasDuplicateProject = projects.some((project) => {
      if (editingProjectId && project.id === editingProjectId) {
        return false
      }

      return project.name.trim().toLowerCase() === normalizedName.toLowerCase()
    })

    if (!nextErrors.name && hasDuplicateProject) {
      nextErrors.name = 'Ese proyecto ya fue registrado.'
    }

    return nextErrors
  }

  const resetForm = () => {
    setProjectData(initialProjectData)
    setEditingProjectId(null)
    setErrors({})
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateProject()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const nextProject = {
      name: projectData.name.trim(),
      description: projectData.description.trim(),
      technologies: projectData.technologies.trim(),
      repository: projectData.repository.trim(),
      deploy: projectData.deploy.trim(),
      image: projectData.image.trim(),
    }

    if (editingProjectId) {
      updateProject(editingProjectId, nextProject)
    } else {
      addProject(nextProject)
    }

    resetForm()
  }

  const handleEdit = (project) => {
    setEditingProjectId(project.id)
    setProjectData({
      name: project.name || '',
      description: project.description || '',
      technologies: project.technologies || '',
      repository: project.repository || '',
      deploy: project.deploy || '',
      image: project.image || '',
    })
    setErrors({})
  }

  return (
    <section className="editor-card editor-form">
      <div className="section-heading">
        <div>
          <h2>Proyectos</h2>
          <p className="section-copy">
            Agrega proyectos profesionales, escolares o personales y mantenlos editables con validacion de duplicados.
          </p>
        </div>

        <span className="section-count">{projects.length}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="editor-grid">
          <label className="field">
            <span className="field-label">Nombre del proyecto</span>
            <input
              className={`field-input${errors.name ? ' error' : ''}`}
              type="text"
              name="name"
              value={projectData.name}
              onChange={handleChange}
              placeholder="Ej. Sistema de inventario"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label className="field">
            <span className="field-label">Tecnologias utilizadas</span>
            <input
              className={`field-input${errors.technologies ? ' error' : ''}`}
              type="text"
              name="technologies"
              value={projectData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
            {errors.technologies && <span className="field-error">{errors.technologies}</span>}
          </label>

          <label className="field field--full">
            <span className="field-label">Descripcion</span>
            <textarea
              className={`field-input field-textarea${errors.description ? ' error' : ''}`}
              name="description"
              value={projectData.description}
              onChange={handleChange}
              placeholder="Describe brevemente el objetivo y funcionamiento del proyecto."
              rows="4"
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </label>

          <label className="field">
            <span className="field-label">Repositorio</span>
            <input
              className={`field-input${errors.repository ? ' error' : ''}`}
              type="url"
              name="repository"
              value={projectData.repository}
              onChange={handleChange}
              placeholder="https://github.com/usuario/proyecto"
            />
            {errors.repository && <span className="field-error">{errors.repository}</span>}
          </label>

          <label className="field">
            <span className="field-label">Deploy</span>
            <input
              className={`field-input${errors.deploy ? ' error' : ''}`}
              type="url"
              name="deploy"
              value={projectData.deploy}
              onChange={handleChange}
              placeholder="https://mi-proyecto.vercel.app"
            />
            {errors.deploy && <span className="field-error">{errors.deploy}</span>}
          </label>

          <label className="field field--full">
            <span className="field-label">Imagen o captura</span>
            <input
              className={`field-input${errors.image ? ' error' : ''}`}
              type="url"
              name="image"
              value={projectData.image}
              onChange={handleChange}
              placeholder="https://ejemplo.com/captura.jpg"
            />
            {errors.image && <span className="field-error">{errors.image}</span>}
          </label>
        </div>

        <div className="form-actions">
          <p className="skill-form-hint">
            El nombre del proyecto no debe repetirse y las URLs opcionales deben ser validas.
          </p>

          <div className="form-actions-group">
            {editingProjectId && (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}

            <button className="primary-button" type="submit">
              {editingProjectId ? 'Actualizar proyecto' : 'Agregar proyecto'}
            </button>
          </div>
        </div>
      </form>

      <div className="editor-section">
        <h3>Proyectos registrados</h3>

        {projects.length === 0 ? (
          <p className="skills-empty-state">No hay proyectos registrados todavia.</p>
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
