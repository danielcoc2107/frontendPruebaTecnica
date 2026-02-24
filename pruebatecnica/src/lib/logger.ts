type LogLevel = 'info' | 'warn' | 'error'
const log = (level: LogLevel, message: string, context?: unknown): void => {
  const payload = context === undefined ? '' : context
  const label = `[frontend:${level}] ${message}`
  if (level === 'info') { console.info(label, payload); return }
  if (level === 'warn') { console.warn(label, payload); return }
  console.error(label, payload)
}
export const logger = {
  info(message: string, context?: unknown): void { log('info', message, context) },
  warn(message: string, context?: unknown): void { log('warn', message, context) },
  error(message: string, context?: unknown): void { log('error', message, context) },
}
