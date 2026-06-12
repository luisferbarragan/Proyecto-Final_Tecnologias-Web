import { useState } from 'react'
import { useCV } from '../context/CVContext'

function SkillForm() {
  const { addSkill } = useCV()

  const [skill, setSkill] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!skill.trim()) return

    addSkill(skill)

    setSkill('')
  }

  return (
    <section className="form-section">
      <h2>Habilidades</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de la habilidad</label>

          <input
            type="text"
            value={skill}
            onChange={(event) => setSkill(event.target.value)}
            placeholder="Ej. React, JavaScript, Docker"
          />
        </div>

        <button type="submit">
          Agregar habilidad
        </button>
      </form>
    </section>
  )
}

export default SkillForm