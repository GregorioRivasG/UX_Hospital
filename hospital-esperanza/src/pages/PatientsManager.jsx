import { useState } from 'react';
import Modal from '../components/Modal.jsx';

const EMPTY = {
  name: '', birthDate: '', sexo: '', bloodType: '',
  phone: '', emergencyContact: '', allergies: '', insurance: '',
};

export default function PatientsManager({ patients, onAdd, onDelete }) {
  const [form, setForm]         = useState(EMPTY);
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = patients.filter(p =>
    (p.nombre ?? p.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    String(p.id).includes(search)
  );

  const handleAdd = () => {
    if (!form.name) return;
    onAdd(form);
    setForm(EMPTY);
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  const getName = (p) => p.nombre ?? p.name ?? '';

  return (
    <div className="animate-card" style={{ background: 'var(--bg-primary)', borderRadius: 32, padding: 28, boxShadow: 'var(--card-shadow)' }}>
      <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)' }}>
        <i className="fas fa-users" style={{ color: '#2c7a4d' }}></i>
        Gestión de Pacientes
        <span className="badge badge-info">{patients.length} registrados</span>
      </h2>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, background: 'var(--bg-secondary)', padding: 24, borderRadius: 28 }}>
        <input placeholder="Nombre completo *" {...f('name')} style={{ flex: 1, minWidth: 200 }} />
        <input placeholder="Fecha de nacimiento" type="date" {...f('birthDate')} style={{ width: 180 }} />
        <select {...f('sexo')} style={{ width: 120 }}>
          <option value="">Sexo</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
        <select {...f('bloodType')} style={{ width: 140 }}>
          <option value="">Tipo Sanguíneo</option>
          {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(t => <option key={t}>{t}</option>)}
        </select>
        <input placeholder="Teléfono" type="tel" {...f('phone')} style={{ width: 140 }} />
        <input placeholder="Contacto de emergencia" {...f('emergencyContact')} style={{ width: 200 }} />
        <input placeholder="Alergias" {...f('allergies')} style={{ width: 160 }} />
        <select {...f('insurance')} style={{ width: 130 }}>
          <option value="">Seguro</option>
          {['IMSS','ISSSTE','Particular'].map(s => <option key={s}>{s}</option>)}
        </select>
        <button
          onClick={handleAdd}
          style={{ background: 'var(--gradient-primary)', border: 'none', padding: '12px 28px', borderRadius: 40, color: 'white', fontWeight: 700 }}
        >
          <i className="fas fa-plus"></i> Agregar
        </button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="🔍 Buscar por nombre o ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 380 }}
        />
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Edad</th><th>Teléfono</th><th>Tipo Sang.</th><th>Alergias</th><th>Seguro</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td><i className="fas fa-user-circle"></i> {getName(p)}</td>
                <td>{p.age ?? '—'}</td>
                <td>{p.phone ?? p.contacto ?? '—'}</td>
                <td><span className="badge badge-info">{p.bloodType ?? p.tipo_sangre ?? 'N/D'}</span></td>
                <td>{p.allergies ?? p.alergias ?? 'Ninguna'}</td>
                <td>{p.insurance ?? p.seguro ?? 'N/D'}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setSelected(p)}
                    style={{ background: '#1e6f9f', color: 'white', border: 'none', borderRadius: 30, padding: '6px 12px' }}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 30, padding: '6px 12px' }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)' }}>No se encontraron pacientes</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal title={`Expediente — ${getName(selected)}`} onClose={() => setSelected(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ background: 'var(--gradient-primary)', width: 72, height: 72, borderRadius: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-user-circle" style={{ fontSize: 40, color: 'white' }}></i>
              </div>
              <div>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{getName(selected)}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>ID #{selected.id}</p>
              </div>
            </div>
            <div className="grid-2" style={{ gap: 12 }}>
              {[
                ['fa-birthday-cake', 'Edad',             selected.age        ?? '—'],
                ['fa-tint',          'Tipo Sanguíneo',   selected.bloodType  ?? selected.tipo_sangre ?? 'N/D'],
                ['fa-phone',         'Teléfono',         selected.phone      ?? selected.contacto    ?? '—'],
                ['fa-ambulance',     'Contacto Emerg.',  selected.emergencyContact ?? selected.contacto_emergencia ?? '—'],
                ['fa-allergies',     'Alergias',         selected.allergies  ?? selected.alergias    ?? 'Ninguna'],
                ['fa-shield-alt',    'Seguro',           selected.insurance  ?? selected.seguro      ?? 'N/D'],
                ['fa-venus-mars',    'Sexo',             selected.sexo       ?? '—'],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ color: 'var(--text-primary)' }}>
                  <strong><i className={`fas ${icon}`} style={{ color: 'var(--accent-green)', marginRight: 6 }}></i>{label}:</strong> {val}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
