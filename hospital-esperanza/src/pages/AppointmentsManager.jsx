import { useState } from 'react';

const EMPTY = { patientId: '', doctorId: '', date: '', time: '', reason: '', notes: '' };

const statusBadge = (status) => {
  const map = {
    confirmada: { cls: 'badge-success', icon: 'fa-check',  label: 'Confirmada' },
    pendiente:  { cls: 'badge-warning', icon: 'fa-clock',  label: 'Pendiente'  },
    cancelada:  { cls: 'badge-danger',  icon: 'fa-times',  label: 'Cancelada'  },
    completada: { cls: 'badge-info',    icon: 'fa-flag',   label: 'Completada' },
  };
  const b = map[status] || map.pendiente;
  return <span className={`badge ${b.cls}`}><i className={`fas ${b.icon}`}></i> {b.label}</span>;
};

export default function AppointmentsManager({ appointments, patients, doctors, onAdd, onDelete, onStatusChange }) {
  const [form, setForm]     = useState(EMPTY);
  const [filter, setFilter] = useState('');

  const getPatient = id => patients.find(p => p.id === id);
  const getDoctor  = id => doctors.find(d => d.id === id);

  const filtered = appointments.filter(a => {
    if (!filter) return true;
    const pName = getPatient(a.paciente_id)?.name ?? '';
    const dName = getDoctor(a.medico_id)?.name ?? '';
    return (
      pName.toLowerCase().includes(filter.toLowerCase()) ||
      dName.toLowerCase().includes(filter.toLowerCase()) ||
      a.date.includes(filter)
    );
  });

  const handleAdd = () => {
    if (!form.patientId || !form.doctorId || !form.date) return;
    onAdd({ ...form, patientId: parseInt(form.patientId), doctorId: parseInt(form.doctorId) });
    setForm(EMPTY);
  };

  const f = field => ({
    value: form[field],
    onChange: e => setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  return (
    <div className="animate-card" style={{ background: 'var(--bg-primary)', borderRadius: 32, padding: 28, boxShadow: 'var(--card-shadow)' }}>
      <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)' }}>
        <i className="fas fa-calendar-check" style={{ color: '#f59e0b' }}></i>
        Citas Médicas
        <span className="badge badge-info">{appointments.length} totales</span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, background: 'var(--bg-secondary)', padding: 24, borderRadius: 28, marginBottom: 28 }}>
        <select {...f('patientId')}>
          <option value="">Seleccionar Paciente</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <select {...f('doctorId')}>
          <option value="">Seleccionar Médico</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.nombre} — {d.especialidad}</option>)}
        </select>
        <input type="date" {...f('date')} />
        <input type="time" {...f('time')} />
        <input placeholder="Motivo de consulta" {...f('reason')} />
        <input placeholder="Notas adicionales" {...f('notes')} />
        <button
          onClick={handleAdd}
          style={{ background: 'var(--gradient-primary)', border: 'none', padding: '12px 24px', borderRadius: 40, color: 'white', fontWeight: 700 }}
        >
          <i className="fas fa-calendar-plus"></i> Agendar
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="🔍 Filtrar por paciente, médico o fecha..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ width: '100%', maxWidth: 420 }}
        />
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Paciente</th><th>Médico</th><th>Fecha</th><th>Hora</th><th>Motivo</th><th>Estado</th><th>Notas</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td><i className="fas fa-user"></i> {getPatient(a.paciente_id)?.nombre ?? 'N/A'}</td>
                <td><i className="fas fa-stethoscope"></i> {getDoctor(a.medico_id)?.nombre ?? 'N/A'}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.reason}</td>
                <td>
                  <select
                    value={a.status}
                    onChange={e => onStatusChange(a.id, e.target.value)}
                    style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.85rem' }}
                  >
                    <option value="confirmada">Confirmada</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="completada">Completada</option>
                  </select>
                </td>
                <td><small style={{ color: 'var(--text-secondary)' }}>{a.notes || '—'}</small></td>
                <td>
                  <button
                    onClick={() => onDelete(a.id)}
                    style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 30, padding: '6px 12px' }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)' }}>No hay citas registradas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
