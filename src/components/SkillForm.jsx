import { useState } from 'react'
import { useCV } from '../context/CVContext'
import SkillCard from './SkillCard'

function SkillForm() {
  const { cvData, addSkill } = useCV()

  const [skillData, setSkillData] = useState({
    name: '',
    category: '',
    level: '',
    description: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setSkillData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!skillData.name.trim()) return

    addSkill(skillData)

    setSkillData({
      name: '',
      category: '',
      level: '',
      description: '',
    })
  }

  return (
    <section className="form-section">
      <h2>Habilidades</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Habilidad</label>
          <input
            type="text"
            name="name"
            value={skillData.name}
            onChange={handleChange}
            placeholder="Ej. React"
          />
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <input
            type="text"
            name="category"
            value={skillData.category}
            onChange={handleChange}
            placeholder="Ej. Frontend"
          />
        </div>

        <div className="form-group">
          <label>Nivel</label>
          <select
            name="level"
            value={skillData.level}
            onChange={handleChange}
          >
            <option value="">Selecciona un nivel</option>
            <option value="Básico">Básico</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="description"
            value={skillData.description}
            onChange={handleChange}
            placeholder="Describe brevemente tu experiencia con esta habilidad"
          />
        </div>

        <button type="submit">Agregar habilidad</button>
      </form>

      <div className="skills-list">
        {cvData.skills.map((skill, index) => (
          <SkillCard key={index} skill={skill} />
        ))}
      </div>
    </section>
  )
}

export default SkillForm