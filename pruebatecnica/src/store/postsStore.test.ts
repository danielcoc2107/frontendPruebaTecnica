import { describe, expect, it } from 'vitest'
import { usePostsStore } from './postsStore'

describe('postsStore', () => {
  it('applyLikeEvent updates only matching post', () => {
    usePostsStore.setState({ posts: [
      { id: '1', mensaje: 'A', autorAlias: 'ana', fechaPublicacion: '2026-02-24T10:00:00', totalLikes: 1, likedByMe: false },
      { id: '2', mensaje: 'B', autorAlias: 'bob', fechaPublicacion: '2026-02-24T11:00:00', totalLikes: 3, likedByMe: false },
    ] })

    usePostsStore.getState().applyLikeEvent({ postId: '2', liked: true, totalLikes: 4 })

    const [post1, post2] = usePostsStore.getState().posts
    expect(post1.totalLikes).toBe(1)
    expect(post1.likedByMe).toBe(false)
    expect(post2.totalLikes).toBe(4)
    expect(post2.likedByMe).toBe(true)
  })
})
