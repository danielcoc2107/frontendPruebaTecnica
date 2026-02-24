import type { CreatePostHttpRequest, CreatePostHttpResponse, PostResponse, ToggleLikeHttpRequest, ToggleLikeHttpResponse } from '../types/dto'
import { httpRequest } from './httpClient'

export const postsApi = {
  listPosts(): Promise<PostResponse[]> {
    return httpRequest<PostResponse[]>('/api/posts', { method: 'GET', requiresAuth: true })
  },
  createPost(payload: CreatePostHttpRequest): Promise<CreatePostHttpResponse> {
    return httpRequest<CreatePostHttpResponse>('/api/posts', { method: 'POST', body: payload, requiresAuth: true })
  },
  toggleLike(payload: ToggleLikeHttpRequest): Promise<ToggleLikeHttpResponse> {
    return httpRequest<ToggleLikeHttpResponse>('/api/likes/toggle', { method: 'POST', body: payload, requiresAuth: true })
  },
}
