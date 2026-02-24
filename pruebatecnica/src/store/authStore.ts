import { create } from 'zustand'
import { authApi } from '../api/authApi'
import { ApiError } from '../api/error'
import { tokenStorage } from '../lib/storage'
import type { LoginRequest, RegisterRequest } from '../types/dto'

interface AuthState {
  token: string | null
  loading: boolean
  isRegistering: boolean
  errorMessage: string | null
  errorCorrelationId: string | null
  isAuthenticated: boolean
  login: (payload: LoginRequest) => Promise<boolean>
  register: (payload: RegisterRequest) => Promise<boolean>
  logout: () => void
  forceLogout: () => void
}

const mapLoginError = (error: unknown): string => {
  if (error instanceof ApiError && error.status === 400) { return error.message || 'Credenciales invalidas' }
  return 'No fue posible iniciar sesion'
}
const mapRegisterError = (error: unknown): string => {
  if (error instanceof ApiError && (error.status === 400 || error.status === 409)) {
    return error.message || 'No fue posible registrar el usuario'
  }
  return 'No fue posible registrar el usuario'
}

const initialToken = tokenStorage.getToken()

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  loading: false,
  isRegistering: false,
  errorMessage: null,
  errorCorrelationId: null,
  isAuthenticated: initialToken !== null,
  async login(payload) {
    set({ loading: true, errorMessage: null, errorCorrelationId: null })
    try {
      const response = await authApi.login(payload)
      tokenStorage.setToken(response.accessToken)
      set({ token: response.accessToken, loading: false, isAuthenticated: true, errorMessage: null, errorCorrelationId: null })
      return true
    } catch (error: unknown) {
      set({
        loading: false,
        token: null,
        isAuthenticated: false,
        errorMessage: mapLoginError(error),
        errorCorrelationId: error instanceof ApiError ? error.correlationId ?? null : null,
      })
      return false
    }
  },
  async register(payload) {
    set({ isRegistering: true, errorMessage: null, errorCorrelationId: null })
    try {
      await authApi.register(payload)
      set({ isRegistering: false, errorMessage: null, errorCorrelationId: null })
      return true
    } catch (error: unknown) {
      set({
        isRegistering: false,
        errorMessage: mapRegisterError(error),
        errorCorrelationId: error instanceof ApiError ? error.correlationId ?? null : null,
      })
      return false
    }
  },
  logout() {
    tokenStorage.clearToken()
    set({ token: null, isAuthenticated: false, errorMessage: null, errorCorrelationId: null })
  },
  forceLogout() {
    tokenStorage.clearToken()
    set({ token: null, isAuthenticated: false, errorMessage: 'Sesion expirada, inicia sesion nuevamente', errorCorrelationId: null })
  },
}))
