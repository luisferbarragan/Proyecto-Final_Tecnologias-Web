import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          DevProfile
        </Link>
        
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Inicio</Link>
          </li>
          <li className="navbar-item">
            <Link to="/editor" className="navbar-link">Editor</Link>
          </li>
          <li className="navbar-item">
            <Link to="/preview" className="navbar-link">Vista Previa</Link>
          </li>
          <li className="navbar-item">
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link">Acerca De</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
