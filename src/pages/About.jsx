function About() {
  return (
    <section className="page page-about">
      <div className="page-hero card">
        <span className="eyebrow">Acerca del proyecto</span>
        <h1>Proyecto final desarrollado con React</h1>
        <p className="page-text">Proyecto final desarrollado con React para generar un CV profesional en PDF.</p>
      </div>

      <div className="page-grid">
        <article className="info-card card">
          <h2>Objetivo claro</h2>
          <p>Crear una experiencia que facilite la construcción de un currículum moderno, profesional y fácil de compartir.</p>
        </article>
        <article className="info-card card">
          <h2>Enfoque práctico</h2>
          <p>Diseño orientado al usuario con un flujo de edición que mantiene la armonía visual en cada paso.</p>
        </article>
      </div>

      <div className="about-note card">
        <h2>Cierre y retoque final</h2>
        <p>Este proyecto busca ofrecer un acabado armónico para que tanto la navegación como la presentación del CV mantengan coherencia y elegancia.</p>
      </div>
    </section>
  )
}

export default About