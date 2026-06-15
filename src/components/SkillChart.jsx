import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useCV } from '../context/CVContext'

function SkillChart() {
  const { cvData } = useCV()
  const skills = cvData.skills || []

  const getLevelValue = (level) => {
    switch (level) {
      case 'Básico':
        return 33

      case 'Intermedio':
        return 66

      case 'Avanzado':
        return 100

      default:
        return Number(level) || 0
    }
  }

  if (skills.length === 0) {
    return (
      <div className="chart-empty">
        <p>No hay habilidades registradas todavía.</p>
        <p>
          Cuando se agreguen habilidades, aparecerán en esta gráfica.
        </p>
      </div>
    )
  }

  const chartData = skills.map((skill) => ({
    name: skill.name || skill.skill || 'Sin nombre',
    level: getLevelValue(skill.level),
  }))

  return (
    <div className="chart-container">
      <h2>Gráfica de habilidades</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis
            domain={[0, 100]}
            label={{
              value: 'Nivel',
              angle: -90,
              position: 'insideLeft',
            }}
          />

          <Tooltip />

          <Bar dataKey="level" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SkillChart