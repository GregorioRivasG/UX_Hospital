import { useState, useEffect } from 'react';

export default function Header({ highContrast }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString('es-MX'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('es-MX'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dateStr = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const infoBoxStyle = {
    background: highContrast ? '#000000' : 'var(--bg-secondary)',
    color: highContrast ? '#FFFFFF' : 'var(--text-primary)',
    padding: '8px 20px',
    borderRadius: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  return (
    <div
      className="animate-header"
      style={{
        background: 'var(--header-bg)',
        backdropFilter: 'var(--backdrop-blur)',
        borderRadius: 32,
        padding: '20px 32px',
        marginBottom: 28,
        boxShadow: 'var(--card-shadow)',
        border: '1px solid rgba(44,122,77,0.2)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              background: 'var(--gradient-primary)',
              width: 60, height: 60,
              borderRadius: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <i className="fas fa-hospital-user" style={{ fontSize: 32, color: 'white' }}></i>
          </div>
          <div>
            <h1
              style={{
                fontSize: '2rem', fontWeight: 800,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              HOSPITAL ESPERANZA
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              <i className="fas fa-map-marker-alt"></i> Sistema Integral de Gestión Hospitalaria
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={infoBoxStyle}>
            <i className="fas fa-calendar-day" style={{ color: highContrast ? '#FFFFFF' : 'var(--accent-green)' }}></i>
            <span style={{ fontWeight: 500 }}>{dateStr}</span>
          </div>
          <div style={infoBoxStyle}> 
            <i className="fas fa-clock" style={{ color: highContrast ? '#FFFFFF' : 'var(--accent-blue)' }}></i>
            <span style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
