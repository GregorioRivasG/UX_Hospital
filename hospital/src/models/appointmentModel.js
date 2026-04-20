import { db } from "../config/db.js";

export const getAppointments = async (filters) => {
  let sql = `
    SELECT c.*, 
           p.nombre AS paciente, 
           m.nombre AS medico
    FROM citas c
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN medicos m ON c.medico_id = m.id
  `;

  const conditions = [];
  const params = [];

  if (filters.paciente && filters.paciente.trim() !== "") {
    conditions.push("LOWER(p.nombre) LIKE ?");
    params.push(`%${filters.paciente.trim().toLowerCase()}%`);
  }

  if (filters.medico && filters.medico.trim() !== "") {
    conditions.push("LOWER(m.nombre) LIKE ?");
    params.push(`%${filters.medico.trim().toLowerCase()}%`);
  }

  if (filters.fecha && filters.fecha !== "") {
    conditions.push("c.fecha = ?");
    params.push(filters.fecha);
  }

  if (
    filters.hora_inicio && filters.hora_fin &&
    filters.hora_inicio !== "" && filters.hora_fin !== ""
  ) {
    conditions.push("c.hora BETWEEN ? AND ?");
    params.push(filters.hora_inicio, filters.hora_fin);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  console.log("SQL:", sql);
  console.log("PARAMS:", params);

  const [rows] = await db.query(sql, params);
  return rows;
};


export const getAppointmentById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM citas WHERE id = ?",
    [id]
  );
  return rows[0];
};

export const getDoctorSchedule = async (medico_id) => {
  const [rows] = await db.query(
    "SELECT horario_entrada, horario_salida FROM medicos WHERE id = ?",
    [medico_id]
  );
  return rows[0];
};

export const createAppointment = async (data) => {
  const {
    paciente_id,
    medico_id,
    fecha,
    hora,
    motivo,
    notas,
    estatus
  } = data;

  await db.query(
    `INSERT INTO citas 
     (paciente_id, medico_id, fecha, hora, motivo, notas, estatus)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      paciente_id,
      medico_id,
      fecha,
      hora,
      motivo,
      notas,
      estatus || "pendiente"
    ]
  );
};

export const updateAppointment = async (id, data) => {
  const {
    paciente_id,
    medico_id,
    fecha,
    hora,
    motivo,
    notas,
    estatus
  } = data;

  await db.query(
    `UPDATE citas 
     SET paciente_id = ?, medico_id = ?, fecha = ?, hora = ?, 
         motivo = ?, notas = ?, estatus = ?
     WHERE id = ?`,
    [
      paciente_id,
      medico_id,
      fecha,
      hora,
      motivo,
      notas,
      estatus,
      id
    ]
  );
};

export const cancelAppointment = async (id) => {
  await db.query(
    "UPDATE citas SET estatus = 'cancelada' WHERE id = ?",
    [id]
  );
};