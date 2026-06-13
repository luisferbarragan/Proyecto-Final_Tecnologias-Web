function SkillCard({ skill }) {
  return (
    <article className="skill-card">
      <h3>{skill.name}</h3>

      <p>
        <strong>Categoría:</strong> {skill.category}
      </p>

      <p>
        <strong>Nivel:</strong> {skill.level}
      </p>

      <p>{skill.description}</p>
    </article>
  )
}

export default SkillCard