import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface FormState {
  username: string
  password: string
  nombres: string
  apellidos: string
  fechaNacimiento: string
  alias: string
}

const initialFormState: FormState = {
  username: '',
  password: '',
  nombres: '',
  apellidos: '',
  fechaNacimiento: '',
  alias: '',
}

const isValidDateFormat = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value)

export const RegisterPage = () => {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const isRegistering = useAuthStore((state) => state.isRegistering)
  const errorMessage = useAuthStore((state) => state.errorMessage)
  const errorCorrelationId = useAuthStore((state) => state.errorCorrelationId)
  const [form, setForm] = useState<FormState>(initialFormState)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = (): string | null => {
    if (form.password.trim().length < 8) { return 'La password debe tener minimo 8 caracteres' }
    if (form.alias.trim().length < 3) { return 'El alias debe tener minimo 3 caracteres' }
    if (!isValidDateFormat(form.fechaNacimiento)) { return 'La fecha debe estar en formato yyyy-MM-dd' }
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccessMessage(null)
    const currentError = validate()
    if (currentError) {
      setValidationError(currentError)
      return
    }

    setValidationError(null)
    const ok = await register({
      username: form.username.trim(),
      password: form.password,
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      fechaNacimiento: form.fechaNacimiento,
      alias: form.alias.trim(),
    })

    if (!ok) { return }

    setSuccessMessage('Usuario registrado correctamente. Redirigiendo a login...')
    setTimeout(() => navigate('/login', { replace: true }), 1200)
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <section className="mx-auto w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Crear cuenta</h1>
        <p className="mt-2 text-sm text-slate-600">Registra un usuario para ingresar a la red social.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Username</span>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2" name="username" value={form.username} onChange={onChange} required />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2" name="password" type="password" minLength={8} value={form.password} onChange={onChange} required />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Nombres</span>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2" name="nombres" value={form.nombres} onChange={onChange} required />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Apellidos</span>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2" name="apellidos" value={form.apellidos} onChange={onChange} required />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Fecha de nacimiento</span>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={onChange} required />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Alias</span>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2" name="alias" minLength={3} value={form.alias} onChange={onChange} required />
          </label>

          {validationError ? <p className="text-sm font-medium text-red-600">{validationError}</p> : null}
          {errorMessage ? (
            <p className="text-sm font-medium text-red-600">
              {errorMessage}
              {errorCorrelationId ? ` (CorrelationId: ${errorCorrelationId})` : ''}
            </p>
          ) : null}
          {successMessage ? <p className="text-sm font-medium text-emerald-700">{successMessage}</p> : null}

          <button className="w-full rounded-md bg-blue-700 px-4 py-2 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400" type="submit" disabled={isRegistering}>
            {isRegistering ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link className="font-semibold text-blue-700 hover:underline" to="/login">
            Inicia sesion
          </Link>
        </p>
      </section>
    </main>
  )
}
