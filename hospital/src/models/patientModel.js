import { db } from "../config/db.js";

export const getPatients = async (search = "") => {
  const [rows] = await db.query(
    `SELECT * FROM pacientes
     WHERE (nombre LIKE ? OR contacto LIKE ?)
     AND activo = 1`,
    [`%${search}%`, `%${search}%`]
  );
  return rows;
};

export const getPatientById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM pacientes WHERE id = ?",
    [id]
  );
  return rows[0];
};

export const createPatient = async (data) => {
  const {
    nombre,
    fecha_nacimiento,
    sexo,
    tipo_sangre,
    contacto,
    contacto_emergencia,
    alergias,
    seguro
  } = data;

  await db.query(
    `INSERT INTO pacientes 
    (nombre, fecha_nacimiento, sexo, tipo_sangre, contacto, contacto_emergencia, alergias, seguro)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      fecha_nacimiento,
      sexo,
      tipo_sangre,
      contacto,
      contacto_emergencia,
      alergias,
      seguro
    ]
  );
};

export const updatePatient = async (id, data) => {
  const {
    nombre,
    fecha_nacimiento,
    sexo,
    tipo_sangre,
    contacto,
    contacto_emergencia,
    alergias,
    seguro
  } = data;

  await db.query(
    `UPDATE pacientes 
     SET nombre = ?, fecha_nacimiento = ?, sexo = ?, tipo_sangre = ?, 
         contacto = ?, contacto_emergencia = ?, alergias = ?, seguro = ?
     WHERE id = ?`,
    [
      nombre,
      fecha_nacimiento,
      sexo,
      tipo_sangre,
      contacto,
      contacto_emergencia,
      alergias,
      seguro,
      id
    ]
  );
};

export const deactivatePatient = async (id) => {
  await db.query(
    "UPDATE pacientes SET activo = 0 WHERE id = ?",
    [id]
  );
};