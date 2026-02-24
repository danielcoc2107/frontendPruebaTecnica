import type { ErrorResponse } from '../types/dto'
export class ApiError extends Error {
  status: number
  correlationId?: string
  payload?: ErrorResponse
  constructor(message: string, status: number, correlationId?: string, payload?: ErrorResponse) {
    super(message); this.name = 'ApiError'; this.status = status; this.correlationId = correlationId; this.payload = payload
  }
}
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
export const isErrorResponse = (value: unknown): value is ErrorResponse => {
  if (!isRecord(value)) { return false }
  return typeof value.timestamp === 'string' && typeof value.status === 'number' && typeof value.error === 'string' && typeof value.message === 'string' && typeof value.path === 'string'
}
