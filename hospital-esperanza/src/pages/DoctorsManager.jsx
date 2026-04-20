import { useState } from 'react';

const EMPTY = {
  titulo: 'Dr.', name: '', specialty: '',
  phone: '', email: '',
  horario_entrada: '08:00', horario_salida: '16:00',
};

export default function DoctorsManager({ doctors, onAdd, onDelete }) {
  const [form, setForm] = useState(EMPTY);

  const handleAdd = () => {
    if (!form.name || !form.specialty) return;
    onAdd(form);
    setForm(EMPTY);
  };

  const f = field => ({
    value: form[field],
    onChange: e => setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  const getName = (d) => d.nombre ?? d.name ?? '';

  return (
    <div className="animate-card" style={{ background: 'var(--bg-primary)', borderRadius: 32, padding: 28, boxShadow: 'var(--card-shadow)' }}>
      <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)' }}>
        <i className="fas fa-user-md" style={{ color: '#1e6f9f' }}></i>
        Personal Médico
        <span className="badge badge-info">{doctors.length} especialistas</span>
      </h2>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, background: 'var(--bg-secondary)', padding: 24, borderRadius: 28 }}>
        <select {...f('titulo')} style={{ width: 100 }}>
          <option value="Dr.">Dr.</option>
          <option value="Dra.">Dra.</option>
          <option value="Lic.">Lic.</option>
        </select>
        <input placeholder="Nombre completo *" {...f('name')} style={{ flex: 1, minWidth: 200 }} />
        <input placeholder="Especialidad *" {...f('specialty')} style={{ width: 180 }} />
        <input placeholder="Teléfono" type="tel" {...f('phone')} style={{ width: 140 }} />
        <input placeholder="Email" type="email" {...f('email')} style={{ width: 200 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            <i className="fas fa-clock"></i> Entrada
          </label>
          <input type="time" {...f('horario_entrada')} style={{ width: 120 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            Salida
          </label>
          <input type="time" {...f('horario_salida')} style={{ width: 120 }} />
        </div>
        <button
          onClick={handleAdd}
          style={{ background: 'var(--gradient-primary)', border: 'none', padding: '12px 28px', borderRadius: 40, color: 'white', fontWeight: 700 }}
        >
          <i className="fas fa-plus"></i> Registrar
        </button>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nombre</th><th>Especialidad</th><th>Horario</th><th>Teléfono</th><th>Email</th><th>Rating</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.id}>
                <td>
                  <i className="fas fa-user-md" style={{ color: '#1e6f9f', marginRight: 6 }}></i>
                  {d.titulo ?? ''} {getName(d)}
                </td>
                <td><span className="badge badge-info">{d.especialidad ?? d.specialty ?? '—'}</span></td>
                <td>
                  <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
                  {d.horario_entrada ? d.horario_entrada.slice(0,5) : '—'} - {d.horario_salida ? d.horario_salida.slice(0,5) : '—'}
                </td>
                <td>{d.telefono ?? d.phone ?? '—'}</td>
                <td>{d.correo ?? d.email ?? '—'}</td>
                <td><span className="badge badge-success"><i className="fas fa-star"></i> {d.rating?.toFixed(1) ?? '5.0'}</span></td>
                <td>
                  <button
                    onClick={() => onDelete(d.id)}
                    style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 30, padding: '6px 14px' }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)' }}>No hay médicos registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
