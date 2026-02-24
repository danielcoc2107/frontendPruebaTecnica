interface LoadingStateProps { text?: string }
export const LoadingState = ({ text = 'Cargando...' }: LoadingStateProps) => {
  return <div className="card"><p className="muted">{text}</p></div>
}
