export default function AccessibilityWidget({ highContrast, largeText, nightMode, onToggleContrast, onToggleLargeText, onToggleNight }) {
  const btnStyle = (active, bg, activeBg) => ({
    background: active ? activeBg : bg,
    border: 'none',
    width: 52, height: 52,
    borderRadius: '50%',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    color: active ? '#000' : 'white',
    fontSize: 22,
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 1000, display: 'flex', gap: 12, flexDirection: 'column' }}>
      <button
        onClick={onToggleContrast}
        data-tooltip="Alto contraste"
        style={btnStyle(highContrast, 'var(--accent-green)', '#ffdd44')}
      >
        <i className={`fas ${highContrast ? 'fa-sun' : 'fa-adjust'}`}></i>
      </button>

      <button
        onClick={onToggleLargeText}
        data-tooltip="Texto grande"
        style={btnStyle(largeText, 'var(--accent-blue)', '#ffdd44')}
      >
        <i className="fas fa-text-height"></i>
      </button>

      <button
        onClick={onToggleNight}
        data-tooltip="Modo noche"
        style={btnStyle(nightMode, 'var(--accent-purple)', '#ffdd44')}
      >
        <i className="fas fa-moon"></i>
      </button>
    </div>
  );
}
