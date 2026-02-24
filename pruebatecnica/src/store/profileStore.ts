import { create } from 'zustand'
import { profileApi } from '../api/profileApi'
import { ApiError } from '../api/error'
import type { ProfileResponse } from '../types/dto'

interface ProfileState {
  profile: ProfileResponse | null
  loading: boolean
  errorMessage: string | null
  loadProfile: () => Promise<void>
}

const mapProfileError = (error: unknown): string => {
  if (error instanceof ApiError) { return error.status === 400 ? (error.message || 'Usuario no encontrado') : error.message }
  return 'No fue posible cargar el perfil'
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null, loading: false, errorMessage: null,
  async loadProfile() {
    set({ loading: true, errorMessage: null })
    try { const profile = await profileApi.getMe(); set({ profile, loading: false }) }
    catch (error: unknown) { set({ loading: false, errorMessage: mapProfileError(error) }) }
  },
}))
