import { useState } from 'react'
import { useCV } from '../context/CVContext'

const createEducationId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function EducationForm() {
  const { cvData, addEducation } = useCV()
  const educationEntries = cvData.education.map((entry, index) =>
    typeof entry === 'string'
      ? { id: `legacy-education-${index}`, institution: entry, program: '', period: '', description: '' }
      : entry,
  )

  const [formData, setFormData] = useState({
    institution: '',
    program: '',
    period: '',
    description: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const institution = formData.institution.trim()
    const program = formData.program.trim()
    const period = formData.period.trim()
    const description = formData.description.trim()

    if (!institution || !program || !period || !description) {
      return
    }

    addEducation({
      id: createEducationId(),
      institution,
      program,
      period,
      description,
    })

    setFormData({
      institution: '',
      program: '',
      period: '',
      description: '',
    })
  }

  return (
    <section className="editor-section education-section">
      <h2>Educación, cursos y certificaciones</h2>

      <form className="education-form" onSubmit={handleSubmit}>
        <div className="editor-grid">
          <label className="field">
            <span className="field-label">Institución</span>
            <input
              className="field-input"
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Universidad, plataforma o entidad"
            />
          </label>

          <label className="field">
            <span className="field-label">Programa</span>
            <input
              className="field-input"
              type="text"
              name="program"
              value={formData.program}
              onChange={handleChange}
              placeholder="Licenciatura, curso o certificación"
            />
          </label>

          <label className="field">
            <span className="field-label">Periodo</span>
            <input
              className="field-input"
              type="text"
              name="period"
              value={formData.period}
              onChange={handleChange}
              placeholder="2021 - 2024"
            />
          </label>

          <label className="field field--full">
            <span className="field-label">Descripción</span>
            <textarea
              className="field-input field-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe los aprendizajes, logros o enfoque del programa"
              rows="4"
            />
          </label>
        </div>

        <button className="btn" type="submit">
          Agregar registro
        </button>
      </form>

      <div>
        <h3>Registros educativos</h3>

        {educationEntries.length > 0 ? (
          <ul className="education-list">
            {educationEntries.map((entry) => (
              <li key={entry.id} className="education-item">
                <div className="education-item-header">
                  <strong>{entry.program}</strong>
                  <span>{entry.institution}</span>
                </div>

                <p className="education-item-period">{entry.period}</p>
                <p className="education-item-description">{entry.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="education-empty-state">Todavía no has agregado registros educativos.</p>
        )}
      </div>
    </section>
  )
}

export default EducationForm