import CVPreview from '../components/CVPreview'
import '../styles/cv-form.css'

function Preview() {
  return (
    <section className="container preview-page">
      <div className="editor-hero">
        <p className="editor-kicker">Vista previa</p>
        <h1>Perfil profesional</h1>
        <p className="editor-intro">
          Esta es la información que se va construyendo desde el formulario del editor.
        </p>
      </div>

      <CVPreview />
    </section>
  )
}

export default Preview