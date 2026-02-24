import { create } from 'zustand'
import { postsApi } from '../api/postsApi'
import { ApiError } from '../api/error'
import type { LikeUpdatedEvent, PostResponse } from '../types/dto'

interface ToggleLikeOptions { wsConnected: boolean; sendWsToggle: (postId: string) => void }
interface PostsState {
  posts: PostResponse[]
  loading: boolean
  creating: boolean
  errorMessage: string | null
  loadPosts: () => Promise<void>
  createPost: (message: string) => Promise<boolean>
  toggleLike: (postId: string, options: ToggleLikeOptions) => Promise<void>
  applyLikeEvent: (event: LikeUpdatedEvent) => void
}

const normalizeError = (error: unknown): string => error instanceof ApiError ? error.message : 'Ocurrio un error inesperado'
const updatePostLike = (posts: PostResponse[], postId: string, liked: boolean, totalLikes: number): PostResponse[] => posts.map((post) => post.id === postId ? { ...post, likedByMe: liked, totalLikes } : post)

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [], loading: false, creating: false, errorMessage: null,
  async loadPosts() {
    set({ loading: true, errorMessage: null })
    try { const posts = await postsApi.listPosts(); set({ posts, loading: false }) }
    catch (error: unknown) { set({ errorMessage: normalizeError(error), loading: false }) }
  },
  async createPost(message) {
    set({ creating: true, errorMessage: null })
    try { await postsApi.createPost({ message }); await get().loadPosts(); set({ creating: false }); return true }
    catch (error: unknown) { set({ creating: false, errorMessage: normalizeError(error) }); return false }
  },
  async toggleLike(postId, options) {
    const current = get().posts.find((post) => post.id === postId)
    if (!current) { return }
    if (options.wsConnected) {
      const optimisticLiked = !current.likedByMe
      const optimisticLikes = Math.max(0, current.totalLikes + (optimisticLiked ? 1 : -1))
      set((state) => ({ posts: updatePostLike(state.posts, postId, optimisticLiked, optimisticLikes) }))
      try { options.sendWsToggle(postId) }
      catch {
        set((state) => ({
          posts: updatePostLike(state.posts, postId, current.likedByMe, current.totalLikes),
          errorMessage: 'No fue posible enviar el like por WebSocket',
        }))
      }
      return
    }
    try {
      const response = await postsApi.toggleLike({ postId })
      set((state) => ({ posts: updatePostLike(state.posts, postId, response.liked, response.totalLikes) }))
    } catch (error: unknown) {
      set({ errorMessage: normalizeError(error) })
    }
  },
  applyLikeEvent(event) { set((state) => ({ posts: updatePostLike(state.posts, event.postId, event.liked, event.totalLikes) })) },
}))
