import { create } from 'zustand'
import { authApi } from '../api/authApi'
import { ApiError } from '../api/error'
import { tokenStorage } from '../lib/storage'
import type { LoginRequest } from '../types/dto'

interface AuthState {
  token: string | null
  loading: boolean
  errorMessage: string | null
  isAuthenticated: boolean
  login: (payload: LoginRequest) => Promise<boolean>
  logout: () => void
  forceLogout: () => void
}

const mapLoginError = (error: unknown): string => {
  if (error instanceof ApiError && error.status === 400) { return error.message || 'Credenciales invalidas' }
  return 'No fue posible iniciar sesion'
}

const initialToken = tokenStorage.getToken()

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  loading: false,
  errorMessage: null,
  isAuthenticated: initialToken !== null,
  async login(payload) {
    set({ loading: true, errorMessage: null })
    try {
      const response = await authApi.login(payload)
      tokenStorage.setToken(response.accessToken)
      set({ token: response.accessToken, loading: false, isAuthenticated: true, errorMessage: null })
      return true
    } catch (error: unknown) {
      set({ loading: false, token: null, isAuthenticated: false, errorMessage: mapLoginError(error) })
      return false
    }
  },
  logout() {
    tokenStorage.clearToken()
    set({ token: null, isAuthenticated: false, errorMessage: null })
  },
  forceLogout() {
    tokenStorage.clearToken()
    set({ token: null, isAuthenticated: false, errorMessage: 'Sesion expirada, inicia sesion nuevamente' })
  },
}))
