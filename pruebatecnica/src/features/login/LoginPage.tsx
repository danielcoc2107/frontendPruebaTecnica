import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorBanner } from '../../components/ErrorBanner'
import { useAuthStore } from '../../store/authStore'

export const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const errorMessage = useAuthStore((state) => state.errorMessage)

  useEffect(() => {
    if (isAuthenticated) { navigate('/feed', { replace: true }) }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')
    if (typeof username !== 'string' || typeof password !== 'string') { return }
    await login({ username, password })
  }

  return (
    <main className="app-shell">
      <section className="card stack">
        <h1>Login</h1>
        <p className="muted">Usa tus credenciales del backend.</p>
        <form className="stack" onSubmit={handleSubmit}>
          <label className="stack"><span>Username</span><input name="username" type="text" required /></label>
          <label className="stack"><span>Password</span><input name="password" type="password" required /></label>
          <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        </form>
        <p className="muted">
          ¿No tienes cuenta? <Link to="/register">Registrate</Link>
        </p>
      </section>
      <ErrorBanner message={errorMessage} />
    </main>
  )
}

