import { useState } from 'react';
import { apiLogin, setToken, setUser } from '../api.js';

export default function Login({ onLogin }) {
  const [form, setForm]       = useState({ correo: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.correo || !form.password) {
      setError('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiLogin(form.correo, form.password);
      setToken(data.token);
      setUser({ nombre: data.nombre, rol: data.rol });
      onLogin({ nombre: data.nombre, rol: data.rol });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #eef5ff 0%, #dce8f5 50%, #e0edfa 100%)',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 32,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 20px 60px -12px rgba(0,0,0,0.18)',
        border: '1px solid rgba(44,122,77,0.15)',
        animation: 'bounceIn 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            background: 'linear-gradient(135deg, #2c7a4d, #1e6f9f)',
            width: 72, height: 72,
            borderRadius: 36,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(44,122,77,0.3)',
            marginBottom: 16,
            animation: 'float 3s ease-in-out infinite',
          }}>
            <i className="fas fa-hospital-user" style={{ fontSize: 36, color: 'white' }}></i>
          </div>
          <h1 style={{
            fontSize: '1.8rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #2c7a4d, #1e6f9f)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 4,
          }}>
            Hospital Esperanza
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Sistema Integral de Gestión Hospitalaria
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
              <i className="fas fa-envelope" style={{ color: '#2c7a4d', marginRight: 6 }}></i>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@hospital.com"
              value={form.correo}
              onChange={e => setForm(p => ({ ...p, correo: e.target.value }))}
              onKeyDown={handleKey}
              style={{ width: '100%', borderRadius: 14, padding: '14px 18px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
              <i className="fas fa-lock" style={{ color: '#2c7a4d', marginRight: 6 }}></i>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              onKeyDown={handleKey}
              style={{ width: '100%', borderRadius: 14, padding: '14px 18px' }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2', border: '1px solid #ef4444',
              borderRadius: 12, padding: '10px 16px',
              color: '#dc2626', fontSize: '0.88rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2c7a4d, #1e6f9f)',
              border: 'none',
              borderRadius: 14,
              padding: '14px',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              marginTop: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {loading
              ? <><i className="fas fa-spinner fa-spin"></i> Iniciando sesión...</>
              : <><i className="fas fa-sign-in-alt"></i> Iniciar Sesión</>
            }
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#94a3b8', fontSize: '0.8rem' }}>
          <i className="fas fa-shield-alt" style={{ color: '#2c7a4d', marginRight: 4 }}></i>
          Acceso restringido al personal autorizado
        </p>
      </div>
    </div>
  );
}
