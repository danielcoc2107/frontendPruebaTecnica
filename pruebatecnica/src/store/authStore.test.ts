import { describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './authStore'

describe('authStore', () => {
  it('sets session on successful login', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      accessToken: 'token-123', tokenType: 'Bearer', expiresInSeconds: 7200,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })))

    const ok = await useAuthStore.getState().login({ username: 'ana', password: 'Ana12345!' })
    expect(ok).toBe(true)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().token).toBe('token-123')
  })

  it('returns false and stores message on 400', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      timestamp: '2026-02-24T12:00:00Z', status: 400, error: 'Bad Request', message: 'Credenciales invalidas', path: '/api/auth/login', correlationId: 'corr-1',
    }), { status: 400, headers: { 'Content-Type': 'application/json' } })))

    const ok = await useAuthStore.getState().login({ username: 'ana', password: 'bad' })
    expect(ok).toBe(false)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().errorMessage).toBe('Credenciales invalidas')
  })
})
