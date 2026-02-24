import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const AppHeader = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const handleLogout = (): void => { logout(); navigate('/login', { replace: true }) }

  return (
    <header className="header card">
      <h2>Red Social - Prueba Tecnica</h2>
      {isAuthenticated ? (
        <div className="row">
          <nav className="nav" aria-label="main-nav">
            <Link to="/feed">Feed</Link>
            <Link to="/profile">Perfil</Link>
          </nav>
          <button type="button" className="secondary" onClick={handleLogout}>Logout</button>
        </div>
      ) : null}
    </header>
  )
}

