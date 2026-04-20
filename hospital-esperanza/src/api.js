const BASE_URL = 'http://localhost:3000/api';
export const getToken = () => localStorage.getItem('token');
export const setToken = (t) => localStorage.setItem('token', t);
export const removeToken = () => localStorage.removeItem('token');
export const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};
export const setUser = (u) => localStorage.setItem('user', JSON.stringify(u));
export const removeUser = () => localStorage.removeItem('user');

const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    removeToken();
    removeUser();
    window.location.reload();
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Error en la solicitud');
  }

  return data;
};

export const apiLogin = (correo, password) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ correo, password }),
  });

export const apiGetPatients = (search = '') =>
  apiFetch(`/pacientes?search=${encodeURIComponent(search)}`);

export const apiCreatePatient = (data) =>
  apiFetch('/pacientes', { method: 'POST', body: JSON.stringify(data) });

export const apiDeletePatient = (id) =>
  apiFetch(`/pacientes/${id}`, { method: 'DELETE' });

export const apiUpdatePatient = (id, data) =>
  apiFetch(`/pacientes/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const apiGetDoctors = (search = '') =>
  apiFetch(`/medicos?search=${encodeURIComponent(search)}`);

export const apiCreateDoctor = (data) =>
  apiFetch('/medicos', { method: 'POST', body: JSON.stringify(data) });

export const apiDeleteDoctor = (id) =>
  apiFetch(`/medicos/${id}`, { method: 'DELETE' });

export const apiUpdateDoctor = (id, data) =>
  apiFetch(`/medicos/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const apiGetAppointments = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.paciente) params.append('paciente', filters.paciente);
  if (filters.medico)   params.append('medico',   filters.medico);
  if (filters.fecha)    params.append('fecha',    filters.fecha);
  return apiFetch(`/citas?${params.toString()}`);
};

export const apiCreateAppointment = (data) =>
  apiFetch('/citas', { method: 'POST', body: JSON.stringify(data) });

export const apiUpdateAppointment = (id, data) =>
  apiFetch(`/citas/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const apiDeleteAppointment = (id) =>
  apiFetch(`/citas/${id}`, { method: 'DELETE' });

export const apiGetMedicamentos = () => apiFetch('/medicamentos');

export const apiCreateMedicamento = (data) =>
  apiFetch('/medicamentos', { method: 'POST', body: JSON.stringify(data) });

export const apiUpdateMedicamento = (id, data) =>
  apiFetch(`/medicamentos/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const apiDeleteMedicamento = (id) =>
  apiFetch(`/medicamentos/${id}`, { method: 'DELETE' });

export const apiGetMateriales = () => apiFetch('/materiales');

export const apiCreateMaterial = (data) =>
  apiFetch('/materiales', { method: 'POST', body: JSON.stringify(data) });

export const apiUpdateMaterial = (id, data) =>
  apiFetch(`/materiales/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const apiDeleteMaterial = (id) =>
  apiFetch(`/materiales/${id}`, { method: 'DELETE' });

export const apiGetRooms = () => apiFetch('/habitaciones/');

export const apiCreateRoom = (data) =>
  apiFetch('/habitaciones/', { method: 'POST', body: JSON.stringify(data) });

export const apiUpdateRoom = (id, data) =>
  apiFetch(`/habitaciones/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const apiDeleteRoom = (id) =>
  apiFetch(`/habitaciones/${id}`, { method: 'DELETE' });

export const apiGetLabResults = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.paciente) params.append('paciente', filters.paciente);
  if (filters.examen)   params.append('examen',   filters.examen);
  return apiFetch(`/laboratorio?${params.toString()}`);
};

export const apiCreateLabResult = (data) =>
  apiFetch('/laboratorio', { method: 'POST', body: JSON.stringify(data) });

export const apiUpdateLabResult = (id, data) =>
  apiFetch(`/laboratorio/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const apiDeleteLabResult = (id) =>
  apiFetch(`/laboratorio/${id}`, { method: 'DELETE' });

export const apiGetEmergencias = (search = '') =>
  apiFetch(`/emergencias?search=${encodeURIComponent(search)}`);

export const apiCreateEmergencia = (data) =>
  apiFetch('/emergencias', { method: 'POST', body: JSON.stringify(data) });

export const apiUpdateEmergencia = (id, data) =>
  apiFetch(`/emergencias/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const apiDeleteEmergencia = (id) =>
  apiFetch(`/emergencias/${id}`, { method: 'DELETE' });
