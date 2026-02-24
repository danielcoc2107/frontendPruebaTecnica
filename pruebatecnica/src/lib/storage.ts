const TOKEN_KEY = 'social_app_token'
export const tokenStorage = {
  getToken(): string | null { return typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY) },
  setToken(token: string): void { if (typeof window !== 'undefined') { window.localStorage.setItem(TOKEN_KEY, token) } },
  clearToken(): void { if (typeof window !== 'undefined') { window.localStorage.removeItem(TOKEN_KEY) } },
}
