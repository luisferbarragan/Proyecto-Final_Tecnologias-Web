import { useState } from 'react'
import { useCV } from '../context/CVContext'

const initialEducationData = {
  institution: '',
  program: '',
  period: '',
  description: '',
}

function EducationForm() {
  const { cvData, addEducation, updateEducation, deleteEducation } = useCV()
  const [formData, setFormData] = useState(initialEducationData)
  const [editingEducationId, setEditingEducationId] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
  }

  const validateEducation = () => {
    const nextErrors = {}

    if (!formData.institution.trim()) nextErrors.institution = 'Ingresa la institucion.'
    if (!formData.program.trim()) nextErrors.program = 'Ingresa el programa o certificacion.'
    if (!formData.period.trim()) nextErrors.period = 'Ingresa el periodo.'
    if (!formData.description.trim()) nextErrors.description = 'Agrega una descripcion breve.'

    return nextErrors
  }

  const resetForm = () => {
    setFormData(initialEducationData)
    setEditingEducationId(null)
    setErrors({})
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateEducation()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const nextEducation = {
      institution: formData.institution.trim(),
      program: formData.program.trim(),
      period: formData.period.trim(),
      description: formData.description.trim(),
    }

    if (editingEducationId) {
      updateEducation(editingEducationId, nextEducation)
    } else {
      addEducation(nextEducation)
    }

    resetForm()
  }

  const handleEdit = (entry) => {
    setEditingEducationId(entry.id)
    setFormData({
      institution: entry.institution || '',
      program: entry.program || '',
      period: entry.period || '',
      description: entry.description || '',
    })
    setErrors({})
  }

  return (
    <section className="editor-section education-section">
      <div className="section-heading">
        <div>
          <h2>Educacion, cursos y certificaciones</h2>
          <p className="section-copy">
            Esta informacion debe poder modificarse cuantas veces sea necesario y aparecer en la vista previa y el PDF.
          </p>
        </div>

        <span className="section-count">{cvData.education.length}</span>
      </div>

      <form className="education-form" onSubmit={handleSubmit}>
        <div className="editor-grid">
          <label className="field">
            <span className="field-label">Institucion</span>
            <input
              className={`field-input${errors.institution ? ' error' : ''}`}
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Universidad, plataforma o entidad"
            />
            {errors.institution && <span className="field-error">{errors.institution}</span>}
          </label>

          <label className="field">
            <span className="field-label">Programa</span>
            <input
              className={`field-input${errors.program ? ' error' : ''}`}
              type="text"
              name="program"
              value={formData.program}
              onChange={handleChange}
              placeholder="Licenciatura, curso o certificacion"
            />
            {errors.program && <span className="field-error">{errors.program}</span>}
          </label>

          <label className="field">
            <span className="field-label">Periodo</span>
            <input
              className={`field-input${errors.period ? ' error' : ''}`}
              type="text"
              name="period"
              value={formData.period}
              onChange={handleChange}
              placeholder="2021 - 2024"
            />
            {errors.period && <span className="field-error">{errors.period}</span>}
          </label>

          <label className="field field--full">
            <span className="field-label">Descripcion</span>
            <textarea
              className={`field-input field-textarea${errors.description ? ' error' : ''}`}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe los aprendizajes, logros o enfoque del programa"
              rows="4"
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </label>
        </div>

        <div className="form-actions">
          <p className="skill-form-hint">
            Cada registro debe mantenerse editable y visible al recargar la pagina.
          </p>

          <div className="form-actions-group">
            {editingEducationId && (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}

            <button className="btn" type="submit">
              {editingEducationId ? 'Actualizar registro' : 'Agregar registro'}
            </button>
          </div>
        </div>
      </form>

      <div>
        <h3>Registros educativos</h3>

        {cvData.education.length > 0 ? (
          <ul className="education-list">
            {cvData.education.map((entry) => (
              <li key={entry.id} className="education-item">
                <div className="education-item-header">
                  <strong>{entry.program}</strong>
                  <span>{entry.institution}</span>
                </div>

                <p className="education-item-period">{entry.period}</p>
                <p className="education-item-description">{entry.description}</p>

                <div className="item-actions">
                  <button
                    className="item-action-button item-action-button--edit"
                    type="button"
                    onClick={() => handleEdit(entry)}
                  >
                    Editar
                  </button>

                  <button
                    className="item-action-button item-action-button--delete"
                    type="button"
                    onClick={() => deleteEducation(entry.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="education-empty-state">Todavia no has agregado registros educativos.</p>
        )}
      </div>
    </section>
  )
}

export default EducationForm
