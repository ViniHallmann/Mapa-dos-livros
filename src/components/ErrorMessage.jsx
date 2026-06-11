import './ErrorMessage.css';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-message">
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="error-dismiss">
          x
        </button>
      )}
    </div>
  );
}
