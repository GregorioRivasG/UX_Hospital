export default function Notification({ message, type }) {
  if (!message) return null;

  const bg = type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)';
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

  return (
    <div
      className="notification"
      style={{ background: bg }}
    >
      <i className={`fas ${icon}`}></i>
      {message}
    </div>
  );
}
