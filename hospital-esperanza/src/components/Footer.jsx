export default function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        marginTop: 48,
        padding: 24,
        color: 'var(--text-secondary)',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 12 }}>
        <span><i className="fas fa-heart" style={{ color: '#2c7a4d' }}></i> Hospital Esperanza</span>
        <span><i className="fas fa-clock"></i> Atención 24/7</span>
        <span><i className="fas fa-phone"></i> (55) 1234-5678</span>
        <span><i className="fas fa-envelope"></i> contacto@esperanza.com</span>
      </div>
      <p>© 2025 Hospital Esperanza — Tecnología con calidez humana | Sistema Integral de Gestión Hospitalaria v1.0</p>
    </footer>
  );
}
