import { createCorrelationId } from '../lib/correlation'
import { tokenStorage } from '../lib/storage'
import { ApiError, isErrorResponse } from './error'
import { API_BASE_URL } from './config'

type UnauthorizedHandler = () => void
let onUnauthorized: UnauthorizedHandler | null = null
export const setUnauthorizedHandler = (handler: UnauthorizedHandler): void => { onUnauthorized = handler }
interface RequestOptions { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown; requiresAuth?: boolean; headers?: HeadersInit }
const buildHeaders = (options: RequestOptions): Headers => {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('X-Correlation-Id', createCorrelationId())
  if (options.requiresAuth) {
    const token = tokenStorage.getToken()
    if (token) { headers.set('Authorization', `Bearer ${token}`) }
  }
  return headers
}
const parseResponseError = async (response: Response): Promise<ApiError> => {
  const correlationId = response.headers.get('X-Correlation-Id') ?? undefined
  let parsedBody: unknown
  try { parsedBody = await response.json() } catch { parsedBody = null }
  if (isErrorResponse(parsedBody)) {
    return new ApiError(parsedBody.message, response.status, parsedBody.correlationId ?? correlationId, parsedBody)
  }
  return new ApiError(`Request failed with status ${response.status}`, response.status, correlationId)
}
export const httpRequest = async <TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: buildHeaders(options),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) { onUnauthorized?.() }
    throw await parseResponseError(response)
  }
  return (await response.json()) as TResponse
}
