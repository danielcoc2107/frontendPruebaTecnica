import type { LoginRequest, LoginResponse } from '../types/dto'
import { httpRequest } from './httpClient'

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return httpRequest<LoginResponse>('/api/auth/login', { method: 'POST', body: payload, requiresAuth: false })
  },
}
