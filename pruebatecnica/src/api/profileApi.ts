import type { ProfileResponse } from '../types/dto'
import { httpRequest } from './httpClient'

export const profileApi = {
  getMe(): Promise<ProfileResponse> {
    return httpRequest<ProfileResponse>('/api/users/me', { method: 'GET', requiresAuth: true })
  },
}
