export interface LoginRequest { username: string; password: string }
export interface LoginResponse { accessToken: string; tokenType: 'Bearer' | string; expiresInSeconds: number }
export interface RegisterRequest {
  username: string
  password: string
  nombres: string
  apellidos: string
  fechaNacimiento: string
  alias: string
}
export interface RegisterResponse { id: string; alias: string }
export interface CreatePostHttpRequest { message: string }
export interface CreatePostHttpResponse { postId: string; publishedAt: string }
export interface PostResponse { id: string; mensaje: string; autorAlias: string; fechaPublicacion: string; totalLikes: number; likedByMe: boolean }
export interface ToggleLikeHttpRequest { postId: string }
export interface ToggleLikeHttpResponse { liked: boolean; totalLikes: number }
export interface ProfileResponse { id: string; nombres: string; apellidos: string; alias: string; fechaNacimiento: string }
export interface ToggleLikeWsRequest { postId: string }
export interface LikeUpdatedEvent { postId: string; liked: boolean; totalLikes: number }
export interface ApiErrorResponse { timestamp: string; status: number; error: string; message: string; path: string; correlationId?: string }
export type ErrorResponse = ApiErrorResponse
