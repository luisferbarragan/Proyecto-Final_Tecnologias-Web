import { useCV } from '../context/CVContext'

function PersonalForm() {
  const { cvData, updatePersonalInfo } = useCV()
  const { personalInfo } = cvData

  const handleChange = (event) => {
    const { name, value } = event.target
    updatePersonalInfo(name, value)
  }

  return (
    <section className="form-section">
      <h2>Datos personales</h2>

      <div className="form-group">
        <label>Nombre completo</label>
        <input
          type="text"
          name="fullName"
          value={personalInfo.fullName}
          onChange={handleChange}
          placeholder="Ej. Luis Fernando Barragán"
        />
      </div>

      <div className="form-group">
        <label>Carrera o profesión</label>
        <input
          type="text"
          name="profession"
          value={personalInfo.profession}
          onChange={handleChange}
          placeholder="Ej. Desarrollador Web"
        />
      </div>

      <div className="form-group">
        <label>Ciudad o ubicación</label>
        <input
          type="text"
          name="location"
          value={personalInfo.location}
          onChange={handleChange}
          placeholder="Ej. Aguascalientes, México"
        />
      </div>

      <div className="form-group">
        <label>Correo electrónico</label>
        <input
          type="email"
          name="email"
          value={personalInfo.email}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="text"
          name="phone"
          value={personalInfo.phone}
          onChange={handleChange}
          placeholder="Ej. 449 123 4567"
        />
      </div>

      <div className="form-group">
        <label>Perfil profesional</label>
        <textarea
          name="profile"
          value={personalInfo.profile}
          onChange={handleChange}
          placeholder="Escribe una breve descripción profesional"
        />
      </div>

      <div className="form-group">
        <label>GitHub</label>
        <input
          type="url"
          name="github"
          value={personalInfo.github}
          onChange={handleChange}
          placeholder="https://github.com/usuario"
        />
      </div>

      <div className="form-group">
        <label>LinkedIn</label>
        <input
          type="url"
          name="linkedin"
          value={personalInfo.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/usuario"
        />
      </div>

      <div className="form-group">
        <label>Portafolio web</label>
        <input
          type="url"
          name="portfolio"
          value={personalInfo.portfolio}
          onChange={handleChange}
          placeholder="https://miportafolio.com"
        />
      </div>

      <div className="form-group">
        <label>Imagen de perfil</label>
        <input
          type="url"
          name="profileImage"
          value={personalInfo.profileImage}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>
    </section>
  )
}

export default PersonalForm