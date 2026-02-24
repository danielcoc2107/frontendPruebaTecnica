import { useEffect } from 'react'
import { ErrorBanner } from '../../components/ErrorBanner'
import { LoadingState } from '../../components/LoadingState'
import { useProfileStore } from '../../store/profileStore'

const formatDate = (value: string): string => {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('es-CO')
}

export const ProfilePage = () => {
  const profile = useProfileStore((state) => state.profile)
  const loading = useProfileStore((state) => state.loading)
  const errorMessage = useProfileStore((state) => state.errorMessage)
  const loadProfile = useProfileStore((state) => state.loadProfile)
  useEffect(() => { void loadProfile() }, [loadProfile])

  return (
    <main className="app-shell stack">
      <section className="card stack"><h1>Perfil</h1><p className="muted">Usuario autenticado.</p></section>
      <ErrorBanner message={errorMessage} />
      {loading ? <LoadingState text="Cargando perfil..." /> : null}
      {!loading && profile ? (
        <section className="card stack">
          <p><strong>Nombres:</strong> {profile.nombres}</p>
          <p><strong>Apellidos:</strong> {profile.apellidos}</p>
          <p><strong>Alias:</strong> {profile.alias}</p>
          <p><strong>Fecha de nacimiento:</strong> {formatDate(profile.fechaNacimiento)}</p>
        </section>
      ) : null}
    </main>
  )
}

