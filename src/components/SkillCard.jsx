function SkillCard({ skill, onEdit, onDelete }) {
  return (
    <article className="skill-card">
      <div className="skill-card-header">
        <h3>{skill.name}</h3>
        {skill.level && <span className="skill-badge">{skill.level}</span>}
      </div>

      {skill.category && <p className="skill-card-category">{skill.category}</p>}

      {skill.description && <p className="skill-card-copy">{skill.description}</p>}

      <div className="item-actions">
        <button
          className="item-action-button item-action-button--edit"
          type="button"
          onClick={() => onEdit(skill)}
        >
          Editar
        </button>

        <button
          className="item-action-button item-action-button--delete"
          type="button"
          onClick={() => onDelete(skill.id)}
        >
          Eliminar
        </button>
      </div>
    </article>
  )
}

export default SkillCard
