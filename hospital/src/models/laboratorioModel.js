import { db } from "../config/db.js";

export const getAllLaboratorios = async (filters) => {
  let sql = `
    SELECT l.*, 
           p.nombre AS paciente_nombre,
           m.nombre AS medico_nombre
    FROM laboratorio l
    LEFT JOIN pacientes p ON l.paciente_id = p.id
    LEFT JOIN medicos m ON l.medico_id = m.id
    WHERE 1=1
  `;

  let params = [];


  if (filters.paciente) {
    sql += " AND p.nombre LIKE ?";
    params.push(`%${filters.paciente}%`);
  }

  if (filters.medico) {
    sql += " AND m.nombre LIKE ?";
    params.push(`%${filters.medico}%`);
  }

  if (filters.examen) {
    sql += " AND l.tipo_examen LIKE ?";
    params.push(`%${filters.examen}%`);
  }

  if (filters.fecha) {
    sql += " AND l.fecha = ?";
    params.push(filters.fecha);
  }

  const [rows] = await db.query(sql, params);
  return rows;
};

export const getLaboratorio = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM laboratorio WHERE id=?",
    [id]
  );
  return rows[0];
};

export const createLaboratorio = async (data) => {
  const {
    paciente_id,
    medico_id,
    tipo_examen,
    fecha,
    resultado,
    estatus
  } = data;

  await db.query(
    `INSERT INTO laboratorio
     (paciente_id, medico_id, tipo_examen, fecha, resultado, estatus)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      paciente_id,
      medico_id || null,
      tipo_examen,
      fecha,
      resultado || null,
      estatus || "solicitado"
    ]
  );
};

export const updateLaboratorio = async (id, data) => {
  const {
    paciente_id,
    medico_id = null,
    tipo_examen,
    fecha,
    resultado,
    estatus
  } = data;

  await db.query(
    `UPDATE laboratorio
     SET paciente_id=?, medico_id=?, tipo_examen=?, fecha=?, resultado=?, estatus=?
     WHERE id=?`,
    [
      paciente_id,
      medico_id,
      tipo_examen,
      fecha,
      resultado,
      estatus,
      id
    ]
  );
};

export const deleteLaboratorio = async (id) => {
  await db.query(
    "UPDATE laboratorio SET estatus='cancelado' WHERE id=?",
    [id]
  );
};