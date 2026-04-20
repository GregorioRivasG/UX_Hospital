const today = () => new Date().toISOString().slice(0, 10);

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

export default function Dashboard({ patients, doctors, appointments, rooms, medications, emergencies, labResults, highContrast }) {
  const upcomingApts  = appointments.filter(a => a.date >= today() && a.status !== 'cancelada');
  const availableRooms = rooms.filter(r => r.status === 'disponible').length;
  const occupiedRooms  = rooms.filter(r => r.status === 'ocupada').length;
  const lowStockMeds   = medications.filter(m => m.stock <= m.minStock).length;
  const avgRating      = (doctors.reduce((s, d) => s + d.rating, 0) / doctors.length).toFixed(1);
  const pendingLabs    = labResults.filter(l => l.status === 'en_proceso').length;

  const getPatient = (id) => patients.find(p => p.id === id);
  const getDoctor  = (id) => doctors.find(d => d.id === id);

  const MetricCard = ({ title, value, sub, subColor, icon, iconBg, accent }) => (
    <div className="dashboard-card metric-card" style={{ borderLeft: `4px solid ${accent}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{title}</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: highContrast ? '#FFFFFF' : 'var(--text-primary)' }}>{value}</h2>
          <p style={{ color: subColor, fontSize: '0.85rem', marginTop: 4 }}>{sub}</p>
        </div>
        <div style={{ background: iconBg, width: 60, height: 60, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className={`fas ${icon}`} style={{ fontSize: 28, color: accent }}></i>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-card">
      {/* Fila 1 */}
      <div className="grid-4">
        <MetricCard title="Total Pacientes"     value={patients.length}           sub="↑ Activos en sistema"   subColor="var(--accent-green)"  icon="fa-users"         iconBg="var(--accent-green-light)" accent="#2c7a4d" />
        <MetricCard title="Médicos Activos"     value={doctors.length}            sub={`★ Promedio ${avgRating}/5`} subColor="var(--accent-blue)"  icon="fa-user-md"       iconBg="var(--accent-blue-light)"  accent="#1e6f9f" />
        <MetricCard title="Próximas Citas"      value={upcomingApts.length}       sub={`Total: ${appointments.length}`} subColor="var(--accent-orange)" icon="fa-calendar-check" iconBg="#fff3e0"              accent="#f59e0b" />
        <MetricCard title="Habitaciones Ocup."  value={`${occupiedRooms}/${occupiedRooms + availableRooms}`} sub={`${availableRooms} disponibles`} subColor="var(--accent-red)" icon="fa-hospital" iconBg="#fee2e2" accent="#ef4444" />
      </div>

      {/* Fila 2 */}
      <div className="grid-4" style={{ marginTop: 24 }}>
        <div className="dashboard-card metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)' }}>Stock Bajo</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: highContrast ? '#FFFFFF' : 'var(--text-primary)' }}>{lowStockMeds}</h2>
              <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}><i className="fas fa-exclamation-triangle"></i> Medicamentos</p>
            </div>
            <i className="fas fa-pills" style={{ fontSize: 32, color: 'var(--accent-purple)' }}></i>
          </div>
          <div className="progress-bar" style={{ marginTop: 16 }}>
            <div className="progress-fill" style={{ width: `${(lowStockMeds / medications.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="dashboard-card metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)' }}>Urgencias</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: highContrast ? '#FFFFFF' : 'var(--text-primary)' }}>{emergencies.length}</h2>
              <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}><i className="fas fa-clock"></i> En atención</p>
            </div>
            <i className="fas fa-ambulance" style={{ fontSize: 32, color: '#dc2626' }}></i>
          </div>
        </div>

        <div className="dashboard-card metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)' }}>Laboratorio</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: highContrast ? '#FFFFFF' : 'var(--text-primary)' }}>{pendingLabs}</h2>
              <p style={{ color: 'var(--accent-orange)', fontSize: '0.85rem' }}><i className="fas fa-flask"></i> En proceso</p>
            </div>
            <i className="fas fa-microscope" style={{ fontSize: 32, color: '#06b6d4' }}></i>
          </div>
        </div>

        <div className="dashboard-card metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)' }}>Satisfacción</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: highContrast ? '#FFFFFF' : 'var(--text-primary)' }}>{avgRating}★</h2>
              <p style={{ color: 'var(--accent-green)', fontSize: '0.85rem' }}><i className="fas fa-smile"></i> Excelente</p>
            </div>
            <i className="fas fa-chart-line" style={{ fontSize: 32, color: '#f59e0b' }}></i>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-primary)', borderRadius: 32, padding: 28, marginTop: 32, boxShadow: 'var(--card-shadow)' }}>
        <h2 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)' }}>
          <i className="fas fa-calendar-alt" style={{ color: 'var(--accent-green)' }}></i>
          Próximas Citas
          <span className="badge badge-info">{upcomingApts.length} pendientes</span>
        </h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Paciente</th><th>Médico</th><th>Fecha</th><th>Hora</th><th>Motivo</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {upcomingApts.slice(0, 6).map(apt => (
                <tr key={apt.id}>
              
                  <td>
                    <i className="fas fa-user"></i> {getPatient(apt.paciente_id)?.nombre ?? 'N/A'}
                  </td>
                  
                  <td>
                    <i className="fas fa-stethoscope"></i> {getDoctor(apt.medico_id)?.nombre ?? 'N/A'}
                  </td>

                  <td>{apt.fecha}</td>
                  <td>{apt.hora}</td>
                  <td>{apt.motivo}</td>
                  <td>{statusBadge(apt.estatus)}</td>
                </tr>
              ))}
              {upcomingApts.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)' }}>
                    No hay citas próximas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
