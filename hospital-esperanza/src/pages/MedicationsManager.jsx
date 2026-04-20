import { useState } from 'react';

const EMPTY = { name: '', stock: '', minStock: '100', unit: 'tabletas', price: '' };

export default function MedicationsManager({ medications, onAdd, onDelete }) {
  const [form, setForm] = useState(EMPTY);

  const lowStock = medications.filter(m => m.stock <= m.minStock);

  const handleAdd = () => {
    if (!form.name || !form.stock) return;
    onAdd({
      name:     form.name,
      stock:    parseInt(form.stock),
      minStock: parseInt(form.minStock) || 100,
      unit:     form.unit,
      price:    parseFloat(form.price) || 0,
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
        <i className="fas fa-pills" style={{ color: '#8b5cf6' }}></i>
        Inventario de Farmacia
        {lowStock.length > 0 && (
          <span className="badge badge-danger">
            <i className="fas fa-exclamation-triangle"></i> {lowStock.length} con stock bajo
          </span>
        )}
      </h2>

      {lowStock.length > 0 && (
        <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: 16, padding: '12px 20px', marginBottom: 20, color: '#dc2626' }}>
          <i className="fas fa-exclamation-triangle"></i>
          {' '}Medicamentos con stock bajo: {lowStock.map(m => m.name).join(', ')}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, background: 'var(--bg-secondary)', padding: 24, borderRadius: 28 }}>
        <input placeholder="Nombre del medicamento *" {...f('name')} style={{ flex: 1, minWidth: 200 }} />
        <input placeholder="Stock *" type="number" {...f('stock')} style={{ width: 100 }} />
        <input placeholder="Stock mínimo" type="number" {...f('minStock')} style={{ width: 130 }} />
        <select {...f('unit')} style={{ width: 130 }}>
          <option value="tabletas">Tabletas</option>
          <option value="cápsulas">Cápsulas</option>
          <option value="ml">ml</option>
          <option value="ampollas">Ampollas</option>
          <option value="frascos">Frascos</option>
        </select>
        <input placeholder="Precio $" type="number" step="0.01" {...f('price')} style={{ width: 110 }} />
        <button
          onClick={handleAdd}
          style={{ background: 'var(--gradient-primary)', border: 'none', padding: '12px 28px', borderRadius: 40, color: 'white', fontWeight: 700 }}
        >
          <i className="fas fa-plus"></i> Agregar
        </button>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Medicamento</th><th>Stock Actual</th><th>Stock Mín.</th><th>Unidad</th><th>Precio</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medications.map(m => {
              const isLow = m.stock <= m.minStock;
              return (
                <tr key={m.id}>
                  <td><i className="fas fa-capsules" style={{ color: '#8b5cf6', marginRight: 6 }}></i>{m.nombre}</td>
                  <td><strong>{m.stock}</strong></td>
                  <td>{m.minStock}</td>
                  <td>{m.unit}</td>
                  <td>${m.price.toFixed(2)}</td>
                  <td>
                    {isLow
                      ? <span className="badge badge-danger"><i className="fas fa-exclamation-triangle"></i> Stock Bajo</span>
                      : <span className="badge badge-success"><i className="fas fa-check"></i> Normal</span>
                    }
                  </td>
                  <td>
                    <button
                      onClick={() => onDelete(m.id)}
                      style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 30, padding: '6px 12px' }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
