import { useState } from 'react';

const EMPTY = { patientName: '', condition: '', priority: 'media', doctorId: '' };

const priorityConfig = {
  baja:    { cls: 'badge-info',    icon: 'fa-arrow-down',    label: 'Baja',    color: '#06b6d4' },
  media:   { cls: 'badge-warning', icon: 'fa-minus',         label: 'Media',   color: '#f59e0b' },
  alta:    { cls: 'badge-danger',  icon: 'fa-arrow-up',      label: 'Alta',    color: '#ef4444' },
  critica: { cls: 'badge-danger',  icon: 'fa-exclamation',   label: 'CRÍTICA', color: '#7f1d1d' },
};

const statusConfig = {
  espera:       { cls: 'badge-warning', icon: 'fa-hourglass-half', label: 'En Espera'    },
  atendiendo:   { cls: 'badge-info',    icon: 'fa-user-md',        label: 'Atendiendo'   },
  estabilizado: { cls: 'badge-success', icon: 'fa-check',          label: 'Estabilizado' },
  trasladado:   { cls: 'badge-info',    icon: 'fa-ambulance',      label: 'Trasladado'   },
  alta:         { cls: 'badge-success', icon: 'fa-door-open',      label: 'Alta'         },
};

export default function EmergencyManager({ emergencies, doctors, onAdd, onDelete, onStatusChange }) {
  const [form, setForm] = useState(EMPTY);

  const handleAdd = () => {
    if (!form.patientName || !form.condition) return;
    onAdd({ ...form, doctorId: form.doctorId ? parseInt(form.doctorId) : null });
    setForm(EMPTY);
  };

  const getDoctor = id => doctors.find(d => d.id === id);

  const f = field => ({
    value: form[field],
    onChange: e => setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  const activas = emergencies.filter(e => !['alta', 'trasladado'].includes(e.status));

  return (
    <div className="animate-card" style={{ background: 'var(--bg-primary)', borderRadius: 32, padding: 28, boxShadow: 'var(--card-shadow)' }}>
      <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)', flexWrap: 'wrap' }}>
        <i className="fas fa-ambulance" style={{ color: '#dc2626' }}></i>
        Servicio de Urgencias
        {activas.length > 0 && (
          <span className="badge badge-danger" style={{ animation: 'glowPulse 1.5s infinite' }}>
            <i className="fas fa-circle"></i> {activas.length} activas
          </span>
        )}
      </h2>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, background: 'var(--bg-secondary)', padding: 24, borderRadius: 28 }}>
        <input placeholder="Nombre del paciente *" {...f('patientName')} style={{ flex: 1, minWidth: 180 }} />
        <input placeholder="Condición / Motivo *" {...f('condition')} style={{ flex: 1, minWidth: 180 }} />
        <select {...f('priority')} style={{ width: 130 }}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
        <select {...f('doctorId')} style={{ width: 200 }}>
          <option value="">Médico asignado</option>

          {doctors.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
        </select>
        <button
          onClick={handleAdd}
          style={{ background: 'linear-gradient(135deg, #dc2626, #7f1d1d)', border: 'none', padding: '12px 28px', borderRadius: 40, color: 'white', fontWeight: 700 }}
        >
          <i className="fas fa-plus"></i> Registrar Urgencia
        </button>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Condición</th>
              <th>Prioridad</th>
              <th>Médico</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {emergencies.map(e => {
              const pc = priorityConfig[e.priority] || priorityConfig.media;
              const sc = statusConfig[e.status]     || statusConfig.espera;
              return (
                <tr key={e.id} style={{ borderLeft: `4px solid ${pc.color}` }}>
                  <td><i className="fas fa-user-injured" style={{ color: pc.color, marginRight: 6 }}></i><strong>{e.patientName}</strong></td>
                  <td>{e.condition}</td>

                  <td>
                    <span className={`badge ${pc.cls}`}>
                      <i className={`fas ${pc.icon}`}></i> {pc.label}
                    </span>
                  </td>
                  <td>

                    {e.doctorId ? getDoctor(e.doctorId)?.nombre : <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sin asignar</span>}
                  </td>
                  <td>
                    <select
                      value={e.status}
                      onChange={ev => onStatusChange(e.id, ev.target.value)}
                      style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.85rem' }}
                    >
                      <option value="espera">En Espera</option>
                      <option value="atendiendo">Atendiendo</option>
                      <option value="estabilizado">Estabilizado</option>
                      <option value="trasladado">Trasladado</option>
                      <option value="alta">Alta</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => onDelete(e.id)}
                      style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 30, padding: '6px 12px' }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
            {emergencies.length === 0 && (
              <tr> 
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
                  <i className="fas fa-check-circle" style={{ fontSize: 32, color: '#2c7a4d', display: 'block', marginBottom: 8 }}></i>
                  No hay urgencias activas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}