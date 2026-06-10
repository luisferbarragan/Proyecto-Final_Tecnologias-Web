import { useCV } from '../context/CVContext'
import '../styles/cv-form.css'

function Preview() {
  const { cvData } = useCV()
  const { personalInfo } = cvData

  return (
    <section className="container preview-page">
      <div className="editor-hero">
        <p className="editor-kicker">Vista previa</p>
        <h1>Perfil profesional</h1>
        <p className="editor-intro">
          Esta es la información que se va construyendo desde el formulario del editor.
        </p>
      </div>

      <article className="editor-card preview-card">
        <div className="preview-header">
          {personalInfo.profileImage ? (
            <img
              className="preview-avatar"
              src={personalInfo.profileImage}
              alt={`Foto de ${personalInfo.fullName || 'perfil'}`}
            />
          ) : (
            <div className="preview-avatar preview-avatar--empty">CV</div>
          )}

          <div>
            <h2>{personalInfo.fullName || 'Nombre completo'}</h2>
            <p>{personalInfo.profession || 'Profesión'}</p>
            <p>{personalInfo.city || 'Ciudad'}</p>
          </div>
        </div>

        <div className="preview-grid">
          <div>
            <h3>Contacto</h3>
            <p>{personalInfo.email || 'Correo'}</p>
            <p>{personalInfo.phone || 'Teléfono'}</p>
          </div>

          <div>
            <h3>Enlaces profesionales</h3>
            <p>{personalInfo.github || 'GitHub'}</p>
            <p>{personalInfo.linkedin || 'LinkedIn'}</p>
            <p>{personalInfo.portfolio || 'Portafolio'}</p>
          </div>
        </div>

        <div>
          <h3>Perfil</h3>
          <p className="preview-profile-text">
            {personalInfo.profile || 'Todavía no has escrito una descripción profesional.'}
          </p>
        </div>
      </article>
    </section>
  )
}

export default Preview