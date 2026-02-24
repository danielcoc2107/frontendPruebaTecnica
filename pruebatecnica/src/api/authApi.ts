import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/dto'
import { httpRequest } from './httpClient'
import { authService } from './authService'

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return httpRequest<LoginResponse>('/api/auth/login', { method: 'POST', body: payload, requiresAuth: false })
  },
  register(payload: RegisterRequest): Promise<RegisterResponse> {
    return authService.register(payload)
  },
}
