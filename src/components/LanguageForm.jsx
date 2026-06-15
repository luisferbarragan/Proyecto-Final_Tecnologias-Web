import { useState } from 'react'
import { useCV } from '../context/CVContext'

const levelOptions = ['Basico', 'Intermedio', 'Avanzado', 'Nativo']

const initialLanguageData = {
  name: '',
  level: '',
  description: '',
}

function LanguageForm() {
  const { cvData, addLanguage, updateLanguage, deleteLanguage } = useCV()
  const [languageData, setLanguageData] = useState(initialLanguageData)
  const [editingLanguageId, setEditingLanguageId] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setLanguageData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
  }

  const validateLanguage = () => {
    const nextErrors = {}
    const normalizedName = languageData.name.trim()
    const normalizedLevel = languageData.level.trim()

    if (!normalizedName) nextErrors.name = 'Ingresa el idioma.'
    if (!normalizedLevel) nextErrors.level = 'Selecciona un nivel.'
    if (normalizedLevel && !levelOptions.includes(normalizedLevel)) {
      nextErrors.level = 'Selecciona un nivel valido.'
    }

    const hasDuplicateLanguage = cvData.languages.some((language) => {
      if (editingLanguageId && language.id === editingLanguageId) {
        return false
      }

      return language.name.trim().toLowerCase() === normalizedName.toLowerCase()
    })

    if (!nextErrors.name && hasDuplicateLanguage) {
      nextErrors.name = 'Ese idioma ya fue registrado.'
    }

    return nextErrors
  }

  const resetForm = () => {
    setLanguageData(initialLanguageData)
    setEditingLanguageId(null)
    setErrors({})
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateLanguage()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const nextLanguage = {
      name: languageData.name.trim(),
      level: languageData.level.trim(),
      description: languageData.description.trim(),
    }

    if (editingLanguageId) {
      updateLanguage(editingLanguageId, nextLanguage)
    } else {
      addLanguage(nextLanguage)
    }

    resetForm()
  }

  const handleEdit = (language) => {
    setEditingLanguageId(language.id)
    setLanguageData({
      name: language.name || '',
      level: language.level || '',
      description: language.description || '',
    })
    setErrors({})
  }

  return (
    <section className="editor-section education-section language-section">
      <div className="section-heading">
        <div>
          <h2>Idiomas</h2>
          <p className="section-copy">
            Esta seccion cubre el requisito obligatorio adicional de idiomas o experiencia.
          </p>
        </div>

        <span className="section-count">{cvData.languages.length}</span>
      </div>

      <form className="education-form" onSubmit={handleSubmit}>
        <div className="editor-grid">
          <label className="field">
            <span className="field-label">Idioma</span>
            <input
              className={`field-input${errors.name ? ' error' : ''}`}
              type="text"
              name="name"
              value={languageData.name}
              onChange={handleChange}
              placeholder="Ej. Ingles"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label className="field">
            <span className="field-label">Nivel</span>
            <select
              className={`field-input${errors.level ? ' error' : ''}`}
              name="level"
              value={languageData.level}
              onChange={handleChange}
            >
              <option value="">Selecciona un nivel</option>
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.level && <span className="field-error">{errors.level}</span>}
          </label>

          <label className="field field--full">
            <span className="field-label">Descripcion o certificacion</span>
            <textarea
              className="field-input field-textarea"
              name="description"
              value={languageData.description}
              onChange={handleChange}
              placeholder="Ej. TOEFL, nivel conversacional o experiencia de uso"
              rows="4"
            />
          </label>
        </div>

        <div className="form-actions">
          <p className="skill-form-hint">
            Nombre y nivel son obligatorios. La descripcion funciona como respaldo o evidencia.
          </p>

          <div className="form-actions-group">
            {editingLanguageId && (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}

            <button className="btn" type="submit">
              {editingLanguageId ? 'Actualizar idioma' : 'Agregar idioma'}
            </button>
          </div>
        </div>
      </form>

      <div>
        <h3>Idiomas registrados</h3>

        {cvData.languages.length > 0 ? (
          <ul className="education-list language-list">
            {cvData.languages.map((language) => (
              <li key={language.id} className="education-item language-item">
                <div className="education-item-header language-item-header">
                  <strong>{language.name}</strong>
                  <span>{language.level}</span>
                </div>

                {language.description && (
                  <p className="education-item-description">{language.description}</p>
                )}

                <div className="item-actions">
                  <button
                    className="item-action-button item-action-button--edit"
                    type="button"
                    onClick={() => handleEdit(language)}
                  >
                    Editar
                  </button>

                  <button
                    className="item-action-button item-action-button--delete"
                    type="button"
                    onClick={() => deleteLanguage(language.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="education-empty-state">Todavia no has agregado idiomas.</p>
        )}
      </div>
    </section>
  )
}

export default LanguageForm
