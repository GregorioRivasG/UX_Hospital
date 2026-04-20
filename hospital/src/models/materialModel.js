import { db } from "../config/db.js";

export const getAllMateriales = async () => {
  const [rows] = await db.query(
    "SELECT * FROM materiales WHERE activo=1"
  );
  return rows;
};

export const getMaterial = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM materiales WHERE id=?",
    [id]
  );
  return rows[0];
};

export const createMaterial = async (data) => {
  const { nombre, unidad, stock, stock_minimo } = data;

  await db.query(
    `INSERT INTO materiales 
     (nombre, unidad, stock, stock_minimo)
     VALUES (?, ?, ?, ?)`,
    [nombre, unidad, stock, stock_minimo]
  );
};

export const updateMaterial = async (id, data) => {
  const { nombre, unidad, stock, stock_minimo } = data;

  await db.query(
    `UPDATE materiales 
     SET nombre=?, unidad=?, stock=?, stock_minimo=?
     WHERE id=?`,
    [nombre, unidad, stock, stock_minimo, id]
  );
};

export const deactivateMaterial = async (id) => {
  await db.query(
    "UPDATE materiales SET activo=0 WHERE id=?",
    [id]
  );
};

export const getLowStockMateriales = async () => {
  const [rows] = await db.query(
    `SELECT * FROM materiales 
     WHERE stock <= stock_minimo AND activo=1`
  );
  return rows;
};