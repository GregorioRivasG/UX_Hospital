import { db } from "../config/db.js";

export const findUserByCorreo = async (correo) => {
  const [rows] = await db.query(
    "SELECT * FROM usuarios WHERE correo = ?",
    [correo]
  );
  return rows[0]; 
};

export const createUser = async (nombre, correo, password, rol) => {
  const [result] = await db.query(
    `INSERT INTO usuarios (nombre, correo, password, rol)
     VALUES (?, ?, ?, ?)`,
    [nombre, correo, password, rol]
  );

  return result.insertId;
};

export const getUsers = async (search = "") => {
  const [rows] = await db.query(
    `SELECT id, nombre, correo, rol, activo 
     FROM usuarios
     WHERE nombre LIKE ? OR correo LIKE ?`,
    [`%${search}%`, `%${search}%`]
  );
  return rows;
};


export const updateUser = async (id, nombre, correo, rol) => {
  await db.query(
    `UPDATE usuarios 
     SET nombre = ?, correo = ?, rol = ?
     WHERE id = ?`,
    [nombre, correo, rol, id]
  );
};


export const deactivateUser = async (id) => {
  await db.query(
    `UPDATE usuarios 
     SET activo = 0 
     WHERE id = ?`,
    [id]
  );
};