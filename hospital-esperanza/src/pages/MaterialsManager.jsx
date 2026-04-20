import { useState } from 'react';

const EMPTY = { nombre: '', stock: '', stock_minimo: '100', unidad: 'piezas' };

export default function MaterialsManager({ materials, onAdd, onDelete }) {
  const [form, setForm] = useState(EMPTY);

  const getMaterialName = (material) => {
    const name = material.nombre || material.name || material.nombre_material || material.materialName || '';
    if (!name) {
      console.warn('Material sin nombre detectado:', material);
    }
    return name;
  };

  const getMaterialUnit = (material) => material.unidad || material.unit || 'piezas';
  const getMaterialMinStock = (material) => material.stock_minimo || material.minStock || 0;

  console.log('Materials recibidos:', materials.map(m => ({
    id: m.id,
    nombre: m.nombre,
    name: m.name,
    stock: m.stock
  })));

  const lowStock = materials.filter(m => m.stock <= getMaterialMinStock(m));

  const handleAdd = () => {
    if (!form.nombre || !form.stock) return;
    onAdd({
      nombre: form.nombre,
      stock: parseInt(form.stock),
      stock_minimo: parseInt(form.stock_minimo) || 100,
      unidad: form.unidad,
    });
    setForm(EMPTY);
  };

  const f = field => ({
    value: form[field],
    onChange: e => setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  return (
    <div className="animate-card" style={{ background: 'var(--bg-primary)', borderRadius: 32, padding: 28, boxShadow: 'var(--card-shadow)' }}>
      <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)' }}>
        <i className="fas fa-box-open" style={{ color: '#06b6d4' }}></i>
        Almacén de Materiales
        {lowStock.length > 0 && (
          <span className="badge badge-danger">
            <i className="fas fa-exclamation-triangle"></i> {lowStock.length} con stock bajo
          </span>
        )}
      </h2>

      {lowStock.length > 0 && (
        <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: 16, padding: '12px 20px', marginBottom: 20, color: '#dc2626' }}>
          <i className="fas fa-exclamation-triangle"></i>
          {' '}Materiales con stock bajo: {lowStock.map(m => getMaterialName(m)).join(', ')}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, background: 'var(--bg-secondary)', padding: 24, borderRadius: 28 }}>
        <input placeholder="Nombre del material *" {...f('nombre')} style={{ flex: 1, minWidth: 200 }} />
        <input placeholder="Stock actual *" type="number" {...f('stock')} style={{ width: 120 }} />
        <input placeholder="Stock mínimo" type="number" {...f('stock_minimo')} style={{ width: 130 }} />
        <select {...f('unidad')} style={{ width: 130 }}>
          <option value="piezas">Piezas</option>
          <option value="cajas">Cajas</option>
          <option value="rollos">Rollos</option>
          <option value="paquetes">Paquetes</option>
          <option value="litros">Litros</option>
        </select>
        <button
          onClick={handleAdd}
          style={{ background: 'var(--gradient-primary)', border: 'none', padding: '12px 28px', borderRadius: 40, color: 'white', fontWeight: 700 }}
        >
          <i className="fas fa-plus"></i> Agregar
        </button>
      </div>

      <div className="grid-3">
        {materials.map(m => {
          const minStock = getMaterialMinStock(m);
          const isLow = m.stock <= minStock;
          const pct = Math.min((m.stock / (minStock * 2)) * 100, 100);
          const name = getMaterialName(m);
          const unit = getMaterialUnit(m);
          return (
            <div key={m.id} className="metric-card" style={{ borderLeft: `4px solid ${isLow ? '#ef4444' : '#06b6d4'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 4 }}>MATERIAL</p>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{name}</h3>
                </div>
                <button
                  onClick={() => onDelete(m.id)}
                  style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 30, padding: '4px 10px', fontSize: '0.8rem' }}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Stock: <strong style={{ color: 'var(--text-primary)' }}>{m.stock} {unit}</strong>
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Mín: {minStock}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: isLow ? '#ef4444' : 'var(--gradient-primary)' }}></div>
              </div>
              <div style={{ marginTop: 8 }}>
                {isLow
                  ? <span className="badge badge-danger"><i className="fas fa-exclamation-triangle"></i> Reponer urgente</span>
                  : <span className="badge badge-success"><i className="fas fa-check"></i> Nivel OK</span>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}