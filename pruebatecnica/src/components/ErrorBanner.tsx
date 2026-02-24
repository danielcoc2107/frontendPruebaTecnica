interface ErrorBannerProps { message: string | null }
export const ErrorBanner = ({ message }: ErrorBannerProps) => {
  if (!message) { return null }
  return <div className="card"><p className="error">{message}</p></div>
}

