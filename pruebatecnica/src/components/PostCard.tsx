import { useMemo } from 'react'
import type { PostResponse } from '../types/dto'

interface PostCardProps { post: PostResponse; onToggleLike: (postId: string) => void }
const formatDate = (value: string): string => {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString('es-CO')
}

export const PostCard = ({ post, onToggleLike }: PostCardProps) => {
  const likeLabel = useMemo(() => (post.likedByMe ? 'Unlike' : 'Like'), [post.likedByMe])
  return (
    <article className="card stack">
      <p>{post.mensaje}</p>
      <div className="post-meta">
        <span>Autor: {post.autorAlias}</span>
        <span>Publicacion: {formatDate(post.fechaPublicacion)}</span>
        <span>Total likes: {post.totalLikes}</span>
      </div>
      <div><button type="button" onClick={() => onToggleLike(post.id)}>{likeLabel}</button></div>
    </article>
  )
}
