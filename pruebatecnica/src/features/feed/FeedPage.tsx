import { useEffect, useMemo, useRef, useState } from 'react'
import { ErrorBanner } from '../../components/ErrorBanner'
import { LoadingState } from '../../components/LoadingState'
import { PostCard } from '../../components/PostCard'
import { WS_URL } from '../../api/config'
import { useAuthStore } from '../../store/authStore'
import { usePostsStore } from '../../store/postsStore'
import { StompLikesClient } from '../../ws/stompClient'

export const FeedPage = () => {
  const token = useAuthStore((state) => state.token)
  const posts = usePostsStore((state) => state.posts)
  const loading = usePostsStore((state) => state.loading)
  const creating = usePostsStore((state) => state.creating)
  const errorMessage = usePostsStore((state) => state.errorMessage)
  const loadPosts = usePostsStore((state) => state.loadPosts)
  const createPost = usePostsStore((state) => state.createPost)
  const toggleLike = usePostsStore((state) => state.toggleLike)
  const applyLikeEvent = usePostsStore((state) => state.applyLikeEvent)
  const [message, setMessage] = useState('')
  const wsClientRef = useRef<StompLikesClient | null>(null)

  if (!wsClientRef.current) {
    wsClientRef.current = new StompLikesClient({ wsUrl: WS_URL, tokenProvider: () => token, onLikeEvent: (event) => { applyLikeEvent(event) } })
  }

  useEffect(() => { void loadPosts() }, [loadPosts])
  useEffect(() => {
    wsClientRef.current?.connect()
    return () => { wsClientRef.current?.disconnect() }
  }, [])

  const postIds = useMemo(() => posts.map((post) => post.id), [posts])
  useEffect(() => { wsClientRef.current?.syncSubscriptions(postIds) }, [postIds])

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) { return }
    const created = await createPost(trimmed)
    if (created) { setMessage('') }
  }

  const handleToggleLike = async (postId: string): Promise<void> => {
    const wsClient = wsClientRef.current
    await toggleLike(postId, {
      wsConnected: wsClient?.isConnected() ?? false,
      sendWsToggle: (id) => { wsClient?.sendToggleLike({ postId: id }) },
    })
  }

  return (
    <main className="app-shell stack">
      <section className="card stack">
        <h1>Publicaciones</h1>
        <form className="stack" onSubmit={handleCreate}>
          <label className="stack">
            <span>Crear publicacion</span>
            <textarea name="message" value={message} onChange={(event) => setMessage(event.target.value)} required placeholder="Escribe tu mensaje..." />
          </label>
          <div className="row">
            <button type="submit" disabled={creating || message.trim().length === 0}>{creating ? 'Guardando...' : 'Crear'}</button>
            <p className="muted">o:</p>
          </div>
        </form>
      </section>
      <ErrorBanner message={errorMessage} />
      {loading ? <LoadingState text="Cargando publicaciones..." /> : null}
      {!loading && posts.length === 0 ? <section className="card"><p className="muted">No hay publicaciones para mostrar.</p></section> : null}
      {posts.map((post) => <PostCard key={post.id} post={post} onToggleLike={(id) => void handleToggleLike(id)} />)}
    </main>
  )
}

