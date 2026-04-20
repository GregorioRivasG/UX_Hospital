import { useState, useEffect, useCallback } from 'react';

// API
import {
  getToken, getUser, removeToken, removeUser,
  apiGetPatients,    apiCreatePatient,    apiDeletePatient,
  apiGetDoctors,     apiCreateDoctor,     apiDeleteDoctor,
  apiGetAppointments,apiCreateAppointment,apiDeleteAppointment, apiUpdateAppointment,
  apiGetMedicamentos,apiCreateMedicamento,apiDeleteMedicamento, apiUpdateMedicamento,
  apiGetMateriales,  apiCreateMaterial,   apiDeleteMaterial,
  apiGetRooms,       apiCreateRoom,       apiDeleteRoom,        apiUpdateRoom,
  apiGetLabResults,  apiCreateLabResult,  apiDeleteLabResult,   apiUpdateLabResult,
  apiGetEmergencias, apiCreateEmergencia, apiDeleteEmergencia,  apiUpdateEmergencia,
} from './api.js';

// Componentes
import Header             from './components/Header.jsx';
import Navigation         from './components/Navigation.jsx';
import Footer             from './components/Footer.jsx';
import AccessibilityWidget from './components/AccessibilityWidget.jsx';
import Notification       from './components/Notification.jsx';
import Login              from './components/Login.jsx';

// Páginas
import Dashboard          from './pages/Dashboard.jsx';
import PatientsManager    from './pages/PatientsManager.jsx';
import DoctorsManager     from './pages/DoctorsManager.jsx';
import AppointmentsManager from './pages/AppointmentsManager.jsx';
import MedicationsManager from './pages/MedicationsManager.jsx';
import MaterialsManager   from './pages/MaterialsManager.jsx';
import RoomsManager       from './pages/RoomsManager.jsx';
import LaboratoryManager  from './pages/LaboratoryManager.jsx';
import EmergencyManager   from './pages/EmergencyManager.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getToken() ? getUser() : null);

  const handleLogin = (user) => setCurrentUser(user);

  const handleLogout = () => {
    removeToken();
    removeUser();
    setCurrentUser(null);
  };

  const [patients,     setPatients]     = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medications,  setMedications]  = useState([]);
  const [materials,    setMaterials]    = useState([]);
  const [rooms,        setRooms]        = useState([]);
  const [labResults,   setLabResults]   = useState([]);
  const [emergencies,  setEmergencies]  = useState([]);
  const [loading,      setLoading]      = useState(false);

  const [notif, setNotif] = useState({ msg: '', type: 'success' });

  const notify = useCallback((msg, type = 'success') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif({ msg: '', type: 'success' }), 3200);
  }, []);

  const fetchAll = useCallback(async () => {
    if (!getToken()) return;
    setLoading(true);
    try {
      const [pat, doc, apt, med, mat, rm, lab, emg] = await Promise.all([
        apiGetPatients(),
        apiGetDoctors(),
        apiGetAppointments(),
        apiGetMedicamentos(),
        apiGetMateriales(),
        apiGetRooms(),
        apiGetLabResults(),
        apiGetEmergencias(),
      ]);

      setPatients(pat.map(p => ({
        ...p,
        age: p.fecha_nacimiento
          ? new Date().getFullYear() - new Date(p.fecha_nacimiento).getFullYear()
          : null,
        phone:      p.contacto,
        bloodType:  p.tipo_sangre,
        allergies:  p.alergias,
        insurance:  p.seguro,
        lastVisit:  p.fecha_nacimiento ? p.fecha_nacimiento.slice(0, 10) : null,
      })));

      setDoctors(doc.map(d => ({
        ...d,
        schedule:          `${d.horario_entrada ?? ''} - ${d.horario_salida ?? ''}`,
        phone:             d.telefono,
        email:             d.correo,
        patientsAttended:  0,
        rating:            5.0,
      })));

      setAppointments(apt.map(a => ({
        ...a,
        patientId: a.paciente_id,
        doctorId:  a.medico_id,
        date:      a.fecha ? a.fecha.slice(0, 10) : '',
        time:      a.hora  ? a.hora.slice(0, 5)   : '',
        reason:    a.motivo,
        notes:     a.notas,
        status:    a.estatus,
      })));

      setMedications(med.map(m => ({
        ...m,
        minStock: m.stock_minimo,
        unit:     m.unidad,
        price:    parseFloat(m.precio) || 0,
      })));

      setMaterials(mat.map(m => ({
        ...m,
        minStock: m.stock_minimo,
        unit:     m.unidad,
      })));

      setRooms(rm.map(r => ({
        ...r,
        number: r.numero,
        type:   r.tipo,
        status: r.estatus,
      })));

      setLabResults(lab.map(l => ({
        ...l,
        patientId: l.paciente_id,
        testType:  l.tipo_examen,
        status:    l.estatus,
        result:    l.resultado,
      })));

      setEmergencies(emg.map(e => ({
        ...e,
        patientName: e.nombre_paciente,
        condition:   e.condicion,
        priority:    e.prioridad,
        status:      e.estatus,
        doctorId:    e.medico_id,
        arrivalTime: e.created_at ?? '',
      })));

    } catch (err) {
      notify('Error al cargar datos: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    if (currentUser) fetchAll();
  }, [currentUser, fetchAll]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [highContrast, setHighContrast] = useState(false);
  const [largeText,    setLargeText]    = useState(false);
  const [nightMode,    setNightMode]    = useState(false);

  useEffect(() => {
    const body = document.body;
    body.classList.toggle('high-contrast', highContrast);
    body.classList.toggle('large-text',    largeText);
    body.classList.toggle('night-mode',    nightMode);
  }, [highContrast, largeText, nightMode]);

  const toggleContrast = () => setHighContrast(prev => { if (!prev) setNightMode(false); return !prev; });
  const toggleNight    = () => setNightMode(prev => { if (!prev) setHighContrast(false); return !prev; });

  const addPatient = async (data) => {
    try {
      await apiCreatePatient({
        nombre:               data.name,
        fecha_nacimiento:     data.birthDate || null,
        sexo:                 data.sexo      || null,
        tipo_sangre:          data.bloodType || null,
        contacto:             data.phone     || null,
        contacto_emergencia:  data.emergencyContact || null,
        alergias:             data.allergies || null,
        seguro:               data.insurance || null,
      });
      notify('Paciente registrado exitosamente');
      const pat = await apiGetPatients();
      setPatients(pat.map(p => ({
        ...p,
        age:       p.fecha_nacimiento ? new Date().getFullYear() - new Date(p.fecha_nacimiento).getFullYear() : null,
        phone:     p.contacto,
        bloodType: p.tipo_sangre,
        allergies: p.alergias,
        insurance: p.seguro,
      })));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const deletePatient = async (id) => {
    if (!confirm('¿Eliminar este paciente?')) return;
    try {
      await apiDeletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      setAppointments(prev => prev.filter(a => a.patientId !== id));
      notify('Paciente eliminado');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const addDoctor = async (data) => {
    try {
      await apiCreateDoctor({
        titulo:           data.titulo          || 'Dr.',
        nombre:           data.name,
        especialidad:     data.specialty,
        telefono:         data.phone           || null,
        correo:           data.email           || null,
        horario_entrada:  data.horario_entrada || '08:00',
        horario_salida:   data.horario_salida  || '16:00',
        usuario_id:       null,
      });
      notify('Médico registrado exitosamente');
      const doc = await apiGetDoctors();
      setDoctors(doc.map(d => ({
        ...d,
        schedule: `${d.horario_entrada ?? ''} - ${d.horario_salida ?? ''}`,
        phone:    d.telefono,
        email:    d.correo,
        rating:   5.0,
      })));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const deleteDoctor = async (id) => {
    if (!confirm('¿Eliminar este médico?')) return;
    try {
      await apiDeleteDoctor(id);
      setDoctors(prev => prev.filter(d => d.id !== id));
      setAppointments(prev => prev.filter(a => a.doctorId !== id));
      notify('Médico eliminado');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const addAppointment = async (data) => {
    try {
      await apiCreateAppointment({
        paciente_id: data.patientId,
        medico_id:   data.doctorId,
        fecha:       data.date,
        hora:        data.time   || '08:00',
        motivo:      data.reason || null,
        notas:       data.notes  || null,
        estatus:     'confirmada',
      });
      notify('Cita agendada exitosamente');
      const apt = await apiGetAppointments();
      setAppointments(apt.map(a => ({
        ...a,
        patientId: a.paciente_id,
        doctorId:  a.medico_id,
        date:      a.fecha ? a.fecha.slice(0, 10) : '',
        time:      a.hora  ? a.hora.slice(0, 5)   : '',
        reason:    a.motivo,
        notes:     a.notas,
        status:    a.estatus,
      })));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const deleteAppointment = async (id) => {
    if (!confirm('¿Cancelar y eliminar esta cita?')) return;
    try {
      await apiDeleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
      notify('Cita eliminada');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const apt = appointments.find(a => a.id === id);
      if (!apt) return;
      await apiUpdateAppointment(id, {
        paciente_id: apt.patientId,
        medico_id:   apt.doctorId,
        fecha:       apt.date,
        hora:        apt.time || '08:00',
        motivo:      apt.reason,
        notas:       apt.notes,
        estatus:     status,
      });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      notify(`Cita marcada como ${status}`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const addMedication = async (data) => {
    try {
      await apiCreateMedicamento({
        nombre:       data.name,
        unidad:       data.unit,
        stock:        data.stock,
        stock_minimo: data.minStock,
        precio:       data.price || 0,
      });
      notify('Medicamento agregado');
      const med = await apiGetMedicamentos();
      setMedications(med.map(m => ({ ...m, minStock: m.stock_minimo, unit: m.unidad, price: parseFloat(m.precio) || 0 })));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const deleteMedication = async (id) => {
    if (!confirm('¿Eliminar este medicamento?')) return;
    try {
      await apiDeleteMedicamento(id);
      setMedications(prev => prev.filter(m => m.id !== id));
      notify('Medicamento eliminado');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const addMaterial = async (data) => {
    try {
      await apiCreateMaterial({
        nombre:       data.nombre, 
        unidad:       data.unidad, 
        stock:        data.stock,
        stock_minimo: data.stock_minimo, 
      });
      notify('Material agregado al almacén');
      
      const mat = await apiGetMateriales();
      setMaterials(mat.map(m => ({ 
        ...m, 
        minStock: m.stock_minimo, 
        unit: m.unidad 
      })));
    } catch (err) {
      notify(err.message, 'error');
    }
  };
  const deleteMaterial = async (id) => {
    if (!confirm('¿Eliminar este material?')) return;
    try {
      await apiDeleteMaterial(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
      notify('Material eliminado');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const addRoom = async (data) => {
    try {
      await apiCreateRoom({
        numero:    data.number,
        tipo:      data.type,
        capacidad: data.capacity,
      });
      notify('Habitación agregada');
      const rm = await apiGetRooms();
      setRooms(rm.map(r => ({ ...r, number: r.numero, type: r.tipo, status: r.estatus })));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const deleteRoom = async (id) => {
    if (!confirm('¿Eliminar esta habitación?')) return;
    try {
      await apiDeleteRoom(id);
      setRooms(prev => prev.filter(r => r.id !== id));
      notify('Habitación eliminada');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const updateRoomStatus = async (id, status) => {
    try {
      const room = rooms.find(r => r.id === id);
      if (!room) return;
      await apiUpdateRoom(id, {
        numero:    room.number,
        tipo:      room.type,
        capacidad: room.capacity,
        estatus:   status,
      });
      setRooms(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      notify(`Estado de habitación: ${status}`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const addLabResult = async (data) => {
    try {
      await apiCreateLabResult({
        paciente_id: data.patientId,
        medico_id:   null,
        tipo_examen: data.testType,
        fecha:       new Date().toISOString().slice(0, 10),
        resultado:   data.result   || null,
        estatus:     data.status   || 'solicitado',
      });
      notify('Examen de laboratorio registrado');
      const lab = await apiGetLabResults();
      setLabResults(lab.map(l => ({ ...l, patientId: l.paciente_id, testType: l.tipo_examen, status: l.estatus, result: l.resultado })));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const deleteLabResult = async (id) => {
    if (!confirm('¿Eliminar este registro?')) return;
    try {
      await apiDeleteLabResult(id);
      setLabResults(prev => prev.filter(l => l.id !== id));
      notify('Registro eliminado');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const updateLabStatus = async (id, status) => {
    try {
      const lab = labResults.find(l => l.id === id);
      if (!lab) return;
      await apiUpdateLabResult(id, {
        paciente_id: lab.patientId,
        medico_id:   lab.medico_id || null,
        tipo_examen: lab.testType,
        fecha:       lab.fecha,
        resultado:   lab.result || null,
        estatus:     status,
      });
      setLabResults(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      notify(`Examen actualizado: ${status}`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const addEmergency = async (data) => {
    try {
      await apiCreateEmergencia({
        nombre_paciente: data.patientName,
        paciente_id:     null,
        condicion:       data.condition,
        prioridad:       data.priority,
        estatus:         'espera',
        medico_id:       data.doctorId || null,
      });
      notify('Urgencia registrada');
      const emg = await apiGetEmergencias();
      setEmergencies(emg.map(e => ({ ...e, patientName: e.nombre_paciente, condition: e.condicion, priority: e.prioridad, status: e.estatus, doctorId: e.medico_id })));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const deleteEmergency = async (id) => {
    if (!confirm('¿Eliminar este registro de urgencia?')) return;
    try {
      await apiDeleteEmergencia(id);
      setEmergencies(prev => prev.filter(e => e.id !== id));
      notify('Registro de urgencia eliminado');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const updateEmergencyStatus = async (id, status) => {
    try {
      const emg = emergencies.find(e => e.id === id);
      if (!emg) return;
      await apiUpdateEmergencia(id, {
        nombre_paciente: emg.patientName,
        condicion:       emg.condition,
        prioridad:       emg.priority,
        estatus:         status,
        medico_id:       emg.doctorId || null,
      });
      setEmergencies(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      notify(`Estado de urgencia: ${status}`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const LoadingOverlay = () => (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="loader" style={{ margin: '0 auto 16px' }}></div>
        <p style={{ color: '#2c7a4d', fontWeight: 600 }}>Cargando datos...</p>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard
          patients={patients} doctors={doctors} appointments={appointments}
          rooms={rooms} medications={medications} emergencies={emergencies} labResults={labResults}
        />;
      case 'patients':
        return <PatientsManager patients={patients} onAdd={addPatient} onDelete={deletePatient} />;
      case 'doctors':
        return <DoctorsManager doctors={doctors} onAdd={addDoctor} onDelete={deleteDoctor} />;
      case 'appointments':
        return <AppointmentsManager
          appointments={appointments} patients={patients} doctors={doctors}
          onAdd={addAppointment} onDelete={deleteAppointment} onStatusChange={updateAppointmentStatus}
        />;
      case 'medications':
        return <MedicationsManager medications={medications} onAdd={addMedication} onDelete={deleteMedication} />;
      case 'materials':
        return <MaterialsManager materials={materials} onAdd={addMaterial} onDelete={deleteMaterial} />;
      case 'rooms':
        return <RoomsManager rooms={rooms} onAdd={addRoom} onDelete={deleteRoom} onStatusChange={updateRoomStatus} />;
      case 'laboratory':
        return <LaboratoryManager
          labResults={labResults} patients={patients}
          onAdd={addLabResult} onDelete={deleteLabResult} onStatusChange={updateLabStatus}
        />;
      case 'emergency':
        return <EmergencyManager
          emergencies={emergencies} doctors={doctors}
          onAdd={addEmergency} onDelete={deleteEmergency} onStatusChange={updateEmergencyStatus}
        />;
      default:
        return null;
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}

      <Notification message={notif.msg} type={notif.type} />

      <div style={{ position: 'relative' }}>
        <Header />
        <div style={{
          position: 'absolute', top: 4, right: 32,
          display: 'flex', alignItems: 'center', gap: 12,
          zIndex: 10,
        }}>
          <span style={{
            background: 'var(--bg-secondary)', padding: '6px 16px',
            borderRadius: 40, fontSize: '0.85rem', fontWeight: 600,
            color: 'var(--text-primary)',
          }}>
            <i className="fas fa-user-circle" style={{ color: '#2c7a4d', marginRight: 6 }}></i>
            {currentUser.nombre}
            <span style={{
              marginLeft: 8, fontSize: '0.75rem',
              background: '#e9f5ef', color: '#2c7a4d',
              padding: '2px 8px', borderRadius: 20, fontWeight: 700,
            }}>
              {currentUser.rol}
            </span>
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: '#dc2626', border: 'none',
              borderRadius: 40, padding: '8px 18px',
              color: 'white', fontWeight: 600, fontSize: '0.85rem',
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
        </div>
      </div>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {renderPage()}

      <Footer />

      <AccessibilityWidget
        highContrast={highContrast}
        largeText={largeText}
        nightMode={nightMode}
        onToggleContrast={toggleContrast}
        onToggleLargeText={() => setLargeText(p => !p)}
        onToggleNight={toggleNight}
      />
    </>
  );
}
