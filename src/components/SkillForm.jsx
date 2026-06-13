import { useState } from 'react'
import { useCV } from '../context/CVContext'

function SkillForm() {
  const { cvData, addSkill, updateSkill, deleteSkill } = useCV()
  const skills = cvData.skills.map((skill, index) =>
    typeof skill === 'string'
      ? { id: `legacy-skill-${index}`, name: skill }
      : skill,
  )

  const [skillName, setSkillName] = useState('')
  const [editingSkillId, setEditingSkillId] = useState(null)

  const resetForm = () => {
    setSkillName('')
    setEditingSkillId(null)
  }

  const handleEdit = (skill) => {
    setSkillName(skill.name)
    setEditingSkillId(skill.id)
  }

  const handleDelete = (skillId) => {
    deleteSkill(skillId)

    if (editingSkillId === skillId) {
      resetForm()
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!skillName.trim()) return

    if (editingSkillId) {
      updateSkill(editingSkillId, skillName)
    } else {
      addSkill(skillName)
    }

    resetForm()
  }

  return (
    <section className="editor-section skills-section">
      <h2>Habilidades</h2>

      <form onSubmit={handleSubmit} className="skill-form">
        <div className="field field--full">
          <label className="field-label">Nombre de la habilidad</label>

          <input
            className="field-input"
            type="text"
            value={skillName}
            onChange={(event) => setSkillName(event.target.value)}
            placeholder="Ej. React, JavaScript, Docker"
          />
        </div>

        <div className="skill-form-actions">
          <button className="btn" type="submit">
            {editingSkillId ? 'Guardar cambios' : 'Agregar habilidad'}
          </button>

          {editingSkillId ? (
            <button className="btn btn--secondary" type="button" onClick={resetForm}>
              Cancelar edición
            </button>
          ) : null}
        </div>
      </form>

      <div>
        <h3>Lista de habilidades</h3>

        {skills.length > 0 ? (
          <ul className="skills-list">
            {skills.map((skill) => (
              <li key={skill.id} className="skill-item">
                <span>{skill.name}</span>

                <div className="skill-item-actions">
                  <button
                    className="skill-action-button skill-action-button--edit"
                    type="button"
                    onClick={() => handleEdit(skill)}
                  >
                    Editar
                  </button>
                  <button
                    className="skill-action-button skill-action-button--delete"
                    type="button"
                    onClick={() => handleDelete(skill.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="skills-empty-state">Todavía no has agregado habilidades.</p>
        )}
      </div>
    </section>
  )
}

export default SkillForm