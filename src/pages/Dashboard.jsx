import SkillChart from '../components/SkillChart'

function Dashboard() {
  return (
    <section className="container">
      <h1>Dashboard de habilidades</h1>
      <p>Visualización dinámica de las habilidades registradas en el CV.</p>

      <SkillChart />
    </section>
  )
}

export default Dashboard