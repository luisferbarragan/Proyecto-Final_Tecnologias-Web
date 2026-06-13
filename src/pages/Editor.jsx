import { useCV } from '../context/CVContext'
import SkillForm from '../components/SkillForm'
import EducationForm from '../components/EducationForm'
import '../styles/cv-form.css'

function Editor() {
  const { cvData, updatePersonalInfo } = useCV()
  const { personalInfo } = cvData

  const handleTextChange = (event) => {
    const { name, value } = event.target
    updatePersonalInfo(name, value)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      updatePersonalInfo('profileImage', String(reader.result ?? ''))
    }

    reader.readAsDataURL(file)
  }

  return (
    <section className="container editor-page">
      <div className="editor-hero">
        <p className="editor-kicker">Editor del CV</p>
        <h1>Formulario de datos personales</h1>
        <p className="editor-intro">
          Completa tu perfil profesional con tus datos principales, enlaces y una imagen de perfil.
        </p>
      </div>

      <div className="editor-layout">
        <div className="editor-card editor-stack">
          <form className="editor-form">
          <div className="editor-grid">
            <label className="field">
              <span className="field-label">Nombre</span>
              <input
                className="field-input"
                type="text"
                name="fullName"
                value={personalInfo.fullName}
                onChange={handleTextChange}
                placeholder="Tu nombre completo"
              />
            </label>

            <label className="field">
              <span className="field-label">Profesión</span>
              <input
                className="field-input"
                type="text"
                name="profession"
                value={personalInfo.profession}
                onChange={handleTextChange}
                placeholder="Diseñador UI, Ingeniero de software..."
              />
            </label>

            <label className="field">
              <span className="field-label">Ciudad</span>
              <input
                className="field-input"
                type="text"
                name="city"
                value={personalInfo.city}
                onChange={handleTextChange}
                placeholder="Ciudad de residencia"
              />
            </label>

            <label className="field">
              <span className="field-label">Correo</span>
              <input
                className="field-input"
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handleTextChange}
                placeholder="correo@ejemplo.com"
              />
            </label>

            <label className="field">
              <span className="field-label">Teléfono</span>
              <input
                className="field-input"
                type="tel"
                name="phone"
                value={personalInfo.phone}
                onChange={handleTextChange}
                placeholder="+52 55 0000 0000"
              />
            </label>

            <label className="field field--full">
              <span className="field-label">Perfil</span>
              <textarea
                className="field-input field-textarea"
                name="profile"
                value={personalInfo.profile}
                onChange={handleTextChange}
                placeholder="Resume brevemente tu experiencia, enfoque y objetivos profesionales."
                rows="5"
              />
            </label>
          </div>

          <div className="editor-section">
            <h2>Enlaces profesionales</h2>
            <div className="editor-grid">
              <label className="field">
                <span className="field-label">GitHub</span>
                <input
                  className="field-input"
                  type="url"
                  name="github"
                  value={personalInfo.github}
                  onChange={handleTextChange}
                  placeholder="https://github.com/tuusuario"
                />
              </label>

              <label className="field">
                <span className="field-label">LinkedIn</span>
                <input
                  className="field-input"
                  type="url"
                  name="linkedin"
                  value={personalInfo.linkedin}
                  onChange={handleTextChange}
                  placeholder="https://linkedin.com/in/tuusuario"
                />
              </label>

              <label className="field field--full">
                <span className="field-label">Portafolio</span>
                <input
                  className="field-input"
                  type="url"
                  name="portfolio"
                  value={personalInfo.portfolio}
                  onChange={handleTextChange}
                  placeholder="https://tusitio.com"
                />
              </label>
            </div>
          </div>

          <div className="editor-section">
            <h2>Imagen de perfil</h2>
            <div className="editor-grid">
              <label className="field field--full">
                <span className="field-label">URL de imagen</span>
                <input
                  className="field-input"
                  type="url"
                  name="profileImage"
                  value={personalInfo.profileImage}
                  onChange={handleTextChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </label>

              <label className="field field--full">
                <span className="field-label">Subir imagen</span>
                <input
                  className="field-input field-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          </form>

          <SkillForm />

          <EducationForm />
        </div>

        <aside className="editor-card profile-preview">
          <p className="editor-kicker">Vista rápida</p>
          <h2>Tu perfil</h2>

          {personalInfo.profileImage ? (
            <img
              className="profile-preview-image"
              src={personalInfo.profileImage}
              alt={`Foto de ${personalInfo.fullName || 'perfil'}`}
            />
          ) : (
            <div className="profile-preview-placeholder">Sin imagen de perfil</div>
          )}

          <div className="profile-preview-body">
            <strong>{personalInfo.fullName || 'Tu nombre aparecerá aquí'}</strong>
            <p>{personalInfo.profession || 'Tu profesión aparecerá aquí'}</p>
            <p>{personalInfo.city || 'Tu ciudad aparecerá aquí'}</p>
            <p>{personalInfo.email || 'Tu correo aparecerá aquí'}</p>
            <p>{personalInfo.phone || 'Tu teléfono aparecerá aquí'}</p>
            <p className="profile-preview-profile">
              {personalInfo.profile || 'Agrega una descripción breve de tu perfil profesional.'}
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Editor