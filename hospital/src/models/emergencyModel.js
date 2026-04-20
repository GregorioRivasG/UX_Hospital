import { db } from "../config/db.js";


export const getAllEmergencias = async (search = "") => {
  let sql = `
    SELECT e.*, m.nombre AS medico_nombre
    FROM emergencias e
    LEFT JOIN medicos m ON e.medico_id = m.id
  `;

  let params = [];

  if (search) {
    sql += `
      WHERE e.nombre_paciente LIKE ?
      OR e.prioridad LIKE ?
    `;
    params = [`%${search}%`, `%${search}%`];
  }

  const [rows] = await db.query(sql, params);
  return rows;
};

export const getEmergencia = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM emergencias WHERE id=?",
    [id]
  );
  return rows[0];
};

export const createEmergencia = async (data) => {
  const {
    nombre_paciente,
    paciente_id,
    condicion,
    prioridad,
    estatus,
    medico_id
  } = data;

  await db.query(
    `INSERT INTO emergencias
     (nombre_paciente, paciente_id, condicion, prioridad, estatus, medico_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      nombre_paciente,
      paciente_id || null,
      condicion,
      prioridad,
      estatus || "espera",
      medico_id || null
    ]
  );
};

export const updateEmergencia = async (id, data) => {
  const {
    nombre_paciente,
    paciente_id = null,
    condicion,
    prioridad,
    estatus,
    medico_id = null
  } = data;

  await db.query(
    `UPDATE emergencias
     SET nombre_paciente=?, paciente_id=?, condicion=?, prioridad=?, estatus=?, medico_id=?
     WHERE id=?`,
    [
      nombre_paciente,
      paciente_id,
      condicion,
      prioridad,
      estatus,
      medico_id,
      id
    ]
  );
};

export const closeEmergencia = async (id) => {
  await db.query(
    `UPDATE emergencias SET estatus='alta' WHERE id=?`,
    [id]
  );
};