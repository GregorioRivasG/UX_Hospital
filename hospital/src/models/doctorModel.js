import { db } from "../config/db.js";

export const getDoctors = async (search = "") => {
  const [rows] = await db.query(
    `SELECT * FROM medicos
     WHERE (nombre LIKE ? OR correo LIKE ? OR especialidad LIKE ?)
     AND activo = 1`,
    [`%${search}%`, `%${search}%`, `%${search}%`]
  );
  return rows;
};

export const getDoctorById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM medicos WHERE id = ?",
    [id]
  );
  return rows[0];
};

export const createDoctor = async (data) => {
  const {
    titulo,
    nombre,
    especialidad,
    telefono,
    correo,
    horario_entrada,
    horario_salida,
    usuario_id
  } = data;

  await db.query(
    `INSERT INTO medicos 
     (titulo, nombre, especialidad, telefono, correo, horario_entrada, horario_salida, usuario_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [titulo, nombre, especialidad, telefono, correo, horario_entrada, horario_salida, usuario_id]
  );
};

export const updateDoctor = async (id, data) => {
  const {
    titulo,
    nombre,
    especialidad,
    telefono,
    correo,
    horario_entrada,
    horario_salida
  } = data;

  await db.query(
    `UPDATE medicos 
     SET titulo = ?, nombre = ?, especialidad = ?, telefono = ?, correo = ?, 
         horario_entrada = ?, horario_salida = ?
     WHERE id = ?`,
    [titulo, nombre, especialidad, telefono, correo, horario_entrada, horario_salida, id]
  );
};

export const deactivateDoctor = async (id) => {
  await db.query(
    `UPDATE medicos SET activo = 0 WHERE id = ?`,
    [id]
  );
};