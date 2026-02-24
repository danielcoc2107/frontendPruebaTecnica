import { beforeEach } from 'vitest'
import { useAuthStore } from '../store/authStore'
import { usePostsStore } from '../store/postsStore'
import { useProfileStore } from '../store/profileStore'

beforeEach(() => {
  useAuthStore.setState({ token: null, isAuthenticated: false, loading: false, isRegistering: false, errorMessage: null, errorCorrelationId: null })
  usePostsStore.setState({ posts: [], loading: false, creating: false, errorMessage: null })
  useProfileStore.setState({ profile: null, loading: false, errorMessage: null })
})
