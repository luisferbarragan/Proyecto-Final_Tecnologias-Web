function Home() {
  return (
    <section className="page page-home">
      <div className="page-hero card">
        <span className="eyebrow">Bienvenido</span>
        <h1>DevProfile</h1>
        <p className="page-text">Generador dinámico de CV profesional en PDF.</p>
      </div>

      <div className="page-grid">
        <article className="info-card card">
          <h2>Diseño impecable</h2>
          <p>Convierte tus datos en un CV limpio, legible y listo para descargar con un acabado profesional.</p>
        </article>
        <article className="info-card card">
          <h2>Edición sencilla</h2>
          <p>Personaliza tu perfil, experiencia y habilidades de forma clara y eficiente.</p>
        </article>
        <article className="info-card card">
          <h2>Presentación final</h2>
          <p>Logra una propuesta de valor visual que refuerza la coherencia de tu marca personal.</p>
        </article>
      </div>

      <div className="page-cta card">
        <h2>Tu perfil profesional en un solo flujo</h2>
        <p>Avanza con confianza hacia el cierre del proceso de creación del CV y conserva una estética uniforme en toda la aplicación.</p>
      </div>
    </section>
  )
}

export default Home