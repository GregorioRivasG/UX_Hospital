import { useState } from 'react';

const statusConfig = {
  disponible:   { cls: 'badge-success', icon: 'fa-check-circle', label: 'Disponible',    color: '#2c7a4d' },
  ocupada:      { cls: 'badge-danger',  icon: 'fa-bed',          label: 'Ocupada',        color: '#dc2626' },
  mantenimiento:{ cls: 'badge-warning', icon: 'fa-tools',        label: 'Mantenimiento',  color: '#f59e0b' },
};

const EMPTY = { number: '', type: 'General', capacity: '1' };

export default function RoomsManager({ rooms, onAdd, onDelete, onStatusChange }) {
  const [form, setForm]  = useState(EMPTY);
  const [view, setView]  = useState('cards');

  const handleAdd = () => {
    if (!form.number) return;
    onAdd({ ...form, capacity: parseInt(form.capacity) || 1 });
    setForm(EMPTY);
  };

  const f = field => ({
    value: form[field],
    onChange: e => setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  const disponibles   = rooms.filter(r => r.status === 'disponible').length;
  const ocupadas      = rooms.filter(r => r.status === 'ocupada').length;
  const mantenimiento = rooms.filter(r => r.status === 'mantenimiento').length;

  return (
    <div className="animate-card" style={{ background: 'var(--bg-primary)', borderRadius: 32, padding: 28, boxShadow: 'var(--card-shadow)' }}>
      <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)', flexWrap: 'wrap' }}>
        <i className="fas fa-bed" style={{ color: '#ef4444' }}></i>
        Gestión de Habitaciones
        <span className="badge badge-success">{disponibles} disponibles</span>
        <span className="badge badge-danger">{ocupadas} ocupadas</span>
        <span className="badge badge-warning">{mantenimiento} en mant.</span>
      </h2>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, background: 'var(--bg-secondary)', padding: 24, borderRadius: 28 }}>
        <input placeholder="Número / Código *" {...f('number')} style={{ width: 160 }} />
        <select {...f('type')} style={{ width: 150 }}>
          <option>General</option>
          <option>Privada</option>
          <option>UCI</option>
          <option>Pediatría</option>
          <option>Maternidad</option>
        </select>
        <input placeholder="Capacidad" type="number" min="1" {...f('capacity')} style={{ width: 120 }} />
        <button
          onClick={handleAdd}
          style={{ background: 'var(--gradient-primary)', border: 'none', padding: '12px 28px', borderRadius: 40, color: 'white', fontWeight: 700 }}
        >
          <i className="fas fa-plus"></i> Agregar
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {['cards', 'table'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{ background: view === v ? 'var(--gradient-primary)' : 'var(--bg-primary)', border: '2px solid var(--border-color)', borderRadius: 40, padding: '8px 18px', color: view === v ? 'white' : 'var(--text-primary)', fontWeight: 600 }}
            >
              <i className={`fas ${v === 'cards' ? 'fa-th-large' : 'fa-list'}`}></i>
            </button>
          ))}
        </div>
      </div>

      {view === 'cards' && (
        <div className="grid-3">
          {rooms.map(r => {
            const sc = statusConfig[r.status];
            return (
              <div key={r.id} className="metric-card" style={{ textAlign: 'center', borderLeft: `4px solid ${sc.color}` }}>
                <i
                  className="fas fa-door-open"
                  style={{ fontSize: 40, color: sc.color, marginBottom: 12, display: 'block' }}
                ></i>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 6 }}>Hab. {r.number}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{r.type}</p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: '0.85rem' }}>
                  <i className="fas fa-users"></i> Cap. {r.capacity}
                </p>
                <div style={{ marginBottom: 12 }}>
                  <span className={`badge ${sc.cls}`}>
                    <i className={`fas ${sc.icon}`}></i> {sc.label}
                  </span>
                </div>
                <select
                  value={r.status}
                  onChange={e => onStatusChange(r.id, e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', width: '100%', marginBottom: 8 }}
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
                <button
                  onClick={() => onDelete(r.id)}
                  style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 30, padding: '6px 16px', width: '100%', fontSize: '0.85rem' }}
                >
                  <i className="fas fa-trash-alt"></i> Eliminar
                </button>
              </div>
            );
          })}
        </div>
      )}

      {view === 'table' && (
        <div className="table-responsive">
          <table>
            <thead>
              <tr><th>Número</th><th>Tipo</th><th>Capacidad</th><th>Estado</th><th>Cambiar Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {rooms.map(r => {
                const sc = statusConfig[r.status];
                return (
                  <tr key={r.id}>
                    <td><strong>Hab. {r.number}</strong></td>
                    <td>{r.type}</td>
                    <td>{r.capacity} persona(s)</td>
                    <td><span className={`badge ${sc.cls}`}><i className={`fas ${sc.icon}`}></i> {sc.label}</span></td>
                    <td>
                      <select value={r.status} onChange={e => onStatusChange(r.id, e.target.value)} style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.85rem' }}>
                        <option value="disponible">Disponible</option>
                        <option value="ocupada">Ocupada</option>
                        <option value="mantenimiento">Mantenimiento</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => onDelete(r.id)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 30, padding: '6px 12px' }}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
