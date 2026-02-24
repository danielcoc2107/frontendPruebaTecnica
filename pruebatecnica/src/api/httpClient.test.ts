import { describe, expect, it, vi } from 'vitest'
import { ApiError } from './error'
import { httpRequest } from './httpClient'

describe('httpClient', () => {
  it('throws ApiError parsing backend ErrorResponse', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      timestamp: '2026-02-24T12:00:00Z',
      status: 400,
      error: 'Bad Request',
      message: 'Credenciales invalidas',
      path: '/api/auth/login',
      correlationId: 'abc-123',
    }), { status: 400, headers: { 'Content-Type': 'application/json' } })))

    try {
      await httpRequest('/api/auth/login', { method: 'POST' })
      throw new Error('Expected request to fail')
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ApiError)
      if (error instanceof ApiError) {
        expect(error.status).toBe(400)
        expect(error.correlationId).toBe('abc-123')
      }
    }
  })
})
