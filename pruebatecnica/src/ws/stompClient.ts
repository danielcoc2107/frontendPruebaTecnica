import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { createCorrelationId } from '../lib/correlation'
import { logger } from '../lib/logger'
import type { LikeUpdatedEvent, ToggleLikeWsRequest } from '../types/dto'

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const parseLikeEvent = (payload: unknown): LikeUpdatedEvent | null => {
  if (!isRecord(payload)) { return null }
  const postId = payload.postId
  const liked = payload.liked
  const totalLikes = payload.totalLikes
  if (typeof postId === 'string' && typeof liked === 'boolean' && typeof totalLikes === 'number') {
    return { postId, liked, totalLikes }
  }
  return null
}

interface StompLikesClientParams {
  wsUrl: string
  tokenProvider: () => string | null
  onLikeEvent: (event: LikeUpdatedEvent) => void
}

export class StompLikesClient {
  private client: Client
  private readonly subscriptions = new Map<string, StompSubscription>()
  private readonly params: StompLikesClientParams
  private connected = false

  constructor(params: StompLikesClientParams) {
    this.params = params
    this.client = new Client({
      reconnectDelay: 3000,
      debug: () => { return },
      webSocketFactory: () => new SockJS(this.params.wsUrl),
      connectHeaders: {},
      onConnect: () => { this.connected = true; logger.info('WS connected') },
      onStompError: (frame) => { logger.error('WS stomp error', frame.body) },
      onWebSocketClose: () => { this.connected = false; this.subscriptions.clear(); logger.warn('WS disconnected') },
    })
  }

  isConnected(): boolean { return this.connected }

  connect(): void {
    if (this.client.active) { return }
    const token = this.params.tokenProvider()
    if (!token) { logger.warn('WS skipped: token not found'); return }
    this.client.connectHeaders = { Authorization: `Bearer ${token}`, 'X-Correlation-Id': createCorrelationId() }
    this.client.activate()
  }

  disconnect(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
    this.subscriptions.clear()
    this.connected = false
    this.client.deactivate()
  }

  subscribeToPost(postId: string): void {
    if (!this.client.connected || this.subscriptions.has(postId)) { return }
    const destination = `/topic/posts/${postId}/likes`
    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      let parsedPayload: unknown
      try { parsedPayload = JSON.parse(message.body) as unknown }
      catch { logger.warn('WS invalid message payload'); return }
      const event = parseLikeEvent(parsedPayload)
      if (!event) { logger.warn('WS payload does not match LikeUpdatedEvent', parsedPayload); return }
      this.params.onLikeEvent(event)
    })
    this.subscriptions.set(postId, subscription)
  }

  unsubscribeFromPost(postId: string): void {
    const subscription = this.subscriptions.get(postId)
    if (!subscription) { return }
    subscription.unsubscribe(); this.subscriptions.delete(postId)
  }

  syncSubscriptions(postIds: string[]): void {
    const next = new Set(postIds)
    this.subscriptions.forEach((_subscription, postId) => { if (!next.has(postId)) { this.unsubscribeFromPost(postId) } })
    postIds.forEach((postId) => this.subscribeToPost(postId))
  }

  sendToggleLike(payload: ToggleLikeWsRequest): void {
    if (!this.client.connected) { throw new Error('WS not connected') }
    this.client.publish({
      destination: '/app/likes/toggle',
      body: JSON.stringify(payload),
      headers: { 'X-Correlation-Id': createCorrelationId() },
    })
  }
}
