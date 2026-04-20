const TABS = [
  { id: 'dashboard',    icon: 'fa-chart-line',    label: 'Dashboard',    color: '#2c7a4d' },
  { id: 'patients',     icon: 'fa-users',          label: 'Pacientes',    color: '#2c7a4d' },
  { id: 'doctors',      icon: 'fa-user-md',        label: 'Médicos',      color: '#1e6f9f' },
  { id: 'appointments', icon: 'fa-calendar-check', label: 'Citas',        color: '#f59e0b' },
  { id: 'medications',  icon: 'fa-pills',          label: 'Farmacia',     color: '#8b5cf6' },
  { id: 'materials',    icon: 'fa-box-open',       label: 'Almacén',      color: '#06b6d4' },
  { id: 'rooms',        icon: 'fa-bed',            label: 'Habitaciones', color: '#ef4444' },
  { id: 'laboratory',   icon: 'fa-flask',          label: 'Laboratorio',  color: '#06b6d4' },
  { id: 'emergency',    icon: 'fa-ambulance',      label: 'Urgencias',    color: '#dc2626' },
];

export default function Navigation({ activeTab, setActiveTab }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 32,
        background: 'var(--bg-primary)',
        borderRadius: 60,
        padding: '8px 16px',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-tooltip={tab.label}
            style={{
              background: isActive ? `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)` : 'transparent',
              color: isActive ? 'white' : 'var(--text-primary)',
              border: 'none',
              padding: '12px 22px',
              borderRadius: 40,
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: isActive ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.3s',
            }}
          >
            <i className={`fas ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
