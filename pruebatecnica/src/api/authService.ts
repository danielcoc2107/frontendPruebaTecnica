import axios, { AxiosError } from 'axios'
import { createCorrelationId } from '../lib/correlation'
import type { ApiErrorResponse, RegisterRequest, RegisterResponse } from '../types/dto'
import { API_BASE_URL } from './config'
import { ApiError, isErrorResponse } from './error'

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

authClient.interceptors.request.use((config) => {
  const headers = config.headers ?? {}
  headers['X-Correlation-Id'] = createCorrelationId()
  config.headers = headers
  return config
})

const toApiError = (error: unknown): ApiError => {
  if (!(error instanceof AxiosError) || !error.response) {
    return new ApiError('No fue posible completar la solicitud', 0)
  }

  const { response } = error
  const correlationFromHeader = response.headers['x-correlation-id']
  const payload = response.data

  if (isErrorResponse(payload)) {
    return new ApiError(
      payload.message,
      response.status,
      payload.correlationId ?? correlationFromHeader,
      payload as ApiErrorResponse,
    )
  }

  const defaultMessage = `Request failed with status ${response.status}`
  return new ApiError(defaultMessage, response.status, correlationFromHeader)
}

export const authService = {
  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await authClient.post<RegisterResponse>('/api/auth/register', payload)
      return response.data
    } catch (error: unknown) {
      throw toApiError(error)
    }
  },
}
