interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading today\'s puzzle…' }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
