import { db } from "../config/db.js";

export const getRooms = async () => {
  const [rows] = await db.query(
    "SELECT * FROM habitaciones WHERE activo = 1"
  );
  return rows;
};

export const findRoomByNumber = async (numero) => {
  const [rows] = await db.query(
    "SELECT * FROM habitaciones WHERE numero = ?",
    [numero]
  );
  return rows;
};

export const createRoom = async (data) => {
  const { numero, tipo, capacidad } = data;

  await db.query(
    `INSERT INTO habitaciones (numero, tipo, capacidad, estatus)
     VALUES (?, ?, ?, 'disponible')`,
    [numero, tipo, capacidad]
  );
};

export const updateRoom = async (id, data) => {
  const { numero, tipo, capacidad, estatus } = data;

  await db.query(
    `UPDATE habitaciones 
     SET numero=?, tipo=?, capacidad=?, estatus=?
     WHERE id=?`,
    [numero, tipo, capacidad, estatus, id]
  );
};

export const deleteRoom = async (id) => {
  await db.query(
    "UPDATE habitaciones SET activo = 0 WHERE id = ?",
    [id]
  );
};

export const isRoomOccupied = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM habitaciones_ocupacion
     WHERE habitacion_id = ? AND activo = 1`,
    [id]
  );
  return rows.length > 0;
};

export const searchRoomsByNumber = async (numero) => {
  const [rows] = await db.query(
    `SELECT * FROM habitaciones
     WHERE numero LIKE ? AND activo = 1`,
    [`%${numero}%`]
  );

  return rows;
};