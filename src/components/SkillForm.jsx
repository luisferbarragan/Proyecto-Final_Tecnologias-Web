import { useState } from 'react'
import { useCV } from '../context/CVContext'
import SkillCard from './SkillCard'

const levelOptions = ['Basico', 'Intermedio', 'Avanzado']

const initialSkillData = {
  name: '',
  category: '',
  level: '',
  description: '',
}

function SkillForm() {
  const { cvData, addSkill, updateSkill, deleteSkill } = useCV()
  const skillCount = cvData.skills.length
  const [skillData, setSkillData] = useState(initialSkillData)
  const [editingSkillId, setEditingSkillId] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setSkillData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
      form: '',
    }))
  }

  const validateSkill = () => {
    const nextErrors = {}
    const normalizedName = skillData.name.trim()
    const normalizedCategory = skillData.category.trim()
    const normalizedLevel = skillData.level.trim()
    const normalizedDescription = skillData.description.trim()

    if (!normalizedName) nextErrors.name = 'Ingresa el nombre de la habilidad.'
    if (!normalizedCategory) nextErrors.category = 'Ingresa una categoria.'
    if (!normalizedLevel) nextErrors.level = 'Selecciona un nivel.'
    if (normalizedLevel && !levelOptions.includes(normalizedLevel)) {
      nextErrors.level = 'Selecciona un nivel valido.'
    }
    if (!normalizedDescription) nextErrors.description = 'Agrega una descripcion breve.'

    const hasDuplicateSkill = cvData.skills.some((skill) => {
      if (editingSkillId && skill.id === editingSkillId) {
        return false
      }

      return skill.name.trim().toLowerCase() === normalizedName.toLowerCase()
    })

    if (!nextErrors.name && hasDuplicateSkill) {
      nextErrors.name = 'Esa habilidad ya fue registrada.'
    }

    return nextErrors
  }

  const resetForm = () => {
    setSkillData(initialSkillData)
    setEditingSkillId(null)
    setErrors({})
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateSkill()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const nextSkill = {
      name: skillData.name.trim(),
      category: skillData.category.trim(),
      level: skillData.level.trim(),
      description: skillData.description.trim(),
    }

    if (editingSkillId) {
      updateSkill(editingSkillId, nextSkill)
    } else {
      addSkill(nextSkill)
    }

    resetForm()
  }

  const handleEdit = (skill) => {
    setEditingSkillId(skill.id)
    setSkillData({
      name: skill.name || '',
      category: skill.category || '',
      level: skill.level || '',
      description: skill.description || '',
    })
    setErrors({})
  }

  return (
    <section className="editor-section skills-section">
      <div className="section-heading">
        <div>
          <h2>Habilidades</h2>
          <p className="section-copy">
            Registra habilidades completas con categoria, nivel y descripcion para la grafica, la vista previa y el PDF.
          </p>
        </div>

        <span className="section-count">{skillCount}</span>
      </div>

      <form className="skill-form" onSubmit={handleSubmit}>
        <div className="editor-grid skill-form-grid">
          <label className="field">
            <span className="field-label">Habilidad</span>
            <input
              className={`field-input${errors.name ? ' error' : ''}`}
              type="text"
              name="name"
              value={skillData.name}
              onChange={handleChange}
              placeholder="Ej. React"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label className="field">
            <span className="field-label">Categoria</span>
            <input
              className={`field-input${errors.category ? ' error' : ''}`}
              type="text"
              name="category"
              value={skillData.category}
              onChange={handleChange}
              placeholder="Ej. Frontend"
            />
            {errors.category && <span className="field-error">{errors.category}</span>}
          </label>

          <label className="field">
            <span className="field-label">Nivel</span>
            <select
              className={`field-input${errors.level ? ' error' : ''}`}
              name="level"
              value={skillData.level}
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
            <span className="field-label">Descripcion</span>
            <textarea
              className={`field-input field-textarea skill-textarea${errors.description ? ' error' : ''}`}
              name="description"
              value={skillData.description}
              onChange={handleChange}
              placeholder="Describe brevemente tu experiencia con esta habilidad"
              rows="4"
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </label>
        </div>

        <div className="form-actions">
          <p className="skill-form-hint">
            Todas las habilidades deben poder editarse, eliminarse y reflejarse en la grafica.
          </p>

          <div className="form-actions-group">
            {editingSkillId && (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}

            <button className="primary-button" type="submit">
              {editingSkillId ? 'Actualizar habilidad' : 'Agregar habilidad'}
            </button>
          </div>
        </div>
      </form>

      <div className="skills-showcase">
        <h3>Habilidades registradas</h3>

        {skillCount > 0 ? (
          <div className="skills-list">
            {cvData.skills.map((skill, index) => (
              <SkillCard
                key={skill.id || index}
                skill={skill}
                onEdit={handleEdit}
                onDelete={deleteSkill}
              />
            ))}
          </div>
        ) : (
          <p className="skills-empty-state">
            Todavia no has agregado habilidades. Empieza con una tecnologia, herramienta o fortaleza clave.
          </p>
        )}
      </div>
    </section>
  )
}

export default SkillForm
