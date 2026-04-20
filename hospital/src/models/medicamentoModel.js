import { db } from "../config/db.js";

export const getAllMedicamentos = async () => {
  const [rows] = await db.query(
    "SELECT * FROM medicamentos WHERE activo=1"
  );
  return rows;
};

export const getMedicamento = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM medicamentos WHERE id=?",
    [id]
  );
  return rows[0];
};

export const createMedicamento = async (data) => {
  const { nombre, unidad, stock, stock_minimo, precio } = data;

  await db.query(
    `INSERT INTO medicamentos 
     (nombre, unidad, stock, stock_minimo, precio)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, unidad, stock, stock_minimo, precio]
  );
};

export const updateMedicamento = async (id, data) => {
  const { nombre, unidad, stock, stock_minimo, precio } = data;

  await db.query(
    `UPDATE medicamentos 
     SET nombre=?, unidad=?, stock=?, stock_minimo=?, precio=?
     WHERE id=?`,
    [nombre, unidad, stock, stock_minimo, precio, id]
  );
};

export const deactivateMedicamento = async (id) => {
  await db.query(
    "UPDATE medicamentos SET activo=0 WHERE id=?",
    [id]
  );
};

export const getLowStockMedicamentos = async () => {
  const [rows] = await db.query(
    `SELECT * FROM medicamentos 
     WHERE stock <= stock_minimo AND activo=1`
  );
  return rows;
};