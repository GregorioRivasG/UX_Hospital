import { useState } from 'react';

const EMPTY = { patientId: '', testType: '', result: '', status: 'solicitado' };

const statusBadge = status => {
  const map = {
    solicitado: { cls: 'badge-info',    icon: 'fa-file-medical', label: 'Solicitado' },
    en_proceso: { cls: 'badge-warning', icon: 'fa-spinner',      label: 'En Proceso' },
    completado: { cls: 'badge-success', icon: 'fa-check-circle', label: 'Completado' },
    cancelado:  { cls: 'badge-danger',  icon: 'fa-times-circle', label: 'Cancelado'  },
  };
  const b = map[status] || map.solicitado;
  return <span className={`badge ${b.cls}`}><i className={`fas ${b.icon}`}></i> {b.label}</span>;
};

export default function LaboratoryManager({ labResults, patients, onAdd, onDelete, onStatusChange }) {
  const [form, setForm]   = useState(EMPTY);
  const [filter, setFilter] = useState('');

  const getPatient = id => patients.find(p => p.id === id);

  const filtered = labResults.filter(l => {
    if (!filter) return true;
    const pName = getPatient(l.paciente_id)?.nombre ?? '';
    return (
      pName.toLowerCase().includes(filter.toLowerCase()) ||
      (l.tipo_examen && l.tipo_examen.toLowerCase().includes(filter.toLowerCase()))
    );
  });

  const handleAdd = () => {
    if (!form.patientId || !form.testType) return;
    onAdd({
      patientId: parseInt(form.patientId),
      testType: form.testType,
      result: form.result || '',
      status: form.status || 'solicitado'
    });
    setForm(EMPTY);
  };

  const f = field => ({
    value: form[field],
    onChange: e => setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  const enProceso  = labResults.filter(l => l.estatus === 'en_proceso').length;
  const completado = labResults.filter(l => l.estatus === 'completado').length;
  const solicitado = labResults.filter(l => l.estatus === 'solicitado').length;

  return (
    <div className="animate-card" style={{ background: 'var(--bg-primary)', borderRadius: 32, padding: 28, boxShadow: 'var(--card-shadow)' }}>
      <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)', flexWrap: 'wrap' }}>
        <i className="fas fa-flask" style={{ color: '#06b6d4' }}></i>
        Laboratorio Clínico
        <span className="badge badge-info">{solicitado} solicitados</span>
        <span className="badge badge-warning">{enProceso} en proceso</span>
        <span className="badge badge-success">{completado} completados</span>
      </h2>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, background: 'var(--bg-secondary)', padding: 24, borderRadius: 28 }}>
        <select {...f('patientId')} style={{ flex: 1, minWidth: 180 }}>
          <option value="">Seleccionar Paciente *</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <input placeholder="Tipo de examen *" {...f('testType')} style={{ flex: 1, minWidth: 180 }} />
        <input placeholder="Resultado (puede llenarse después)" {...f('result')} style={{ flex: 1, minWidth: 180 }} />
        <select {...f('status')} style={{ width: 150 }}>
          <option value="solicitado">Solicitado</option>
          <option value="en_proceso">En Proceso</option>
          <option value="completado">Completado</option>
        </select>
        <button
          onClick={handleAdd}
          style={{ background: 'var(--gradient-primary)', border: 'none', padding: '12px 28px', borderRadius: 40, color: 'white', fontWeight: 700 }}
        >
          <i className="fas fa-plus"></i> Registrar
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="🔍 Buscar por paciente o tipo de examen..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ width: '100%', maxWidth: 420 }}
        />
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Paciente</th><th>Tipo de Examen</th><th>Fecha</th><th>Resultado</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id}>
                <td><i className="fas fa-user" style={{ marginRight: 6 }}></i>{getPatient(l.paciente_id)?.nombre ?? 'N/A'}</td>
                <td><i className="fas fa-vial" style={{ color: '#06b6d4', marginRight: 6 }}></i>{l.tipo_examen}</td>
                <td>{l.fecha}</td>
                <td>{l.resultado || <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pendiente</span>}</td>
                <td>
                  <select
                    value={l.estatus}
                    onChange={e => onStatusChange(l.id, e.target.value)}
                    style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.85rem' }}
                  >
                    <option value="solicitado">Solicitado</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => onDelete(l.id)}
                    style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 30, padding: '6px 12px' }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)' }}>No hay resultados registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}