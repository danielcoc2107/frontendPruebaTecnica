export const createCorrelationId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') { return crypto.randomUUID() }
  return `cid-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
