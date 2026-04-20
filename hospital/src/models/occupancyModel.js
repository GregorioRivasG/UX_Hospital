import { db } from "../config/db.js";
export const getRoom = async (habitacion_id) => {
  const [rows] = await db.query(
    "SELECT * FROM habitaciones WHERE id=?",
    [habitacion_id]
  );
  return rows[0];
};

export const countPatients = async (habitacion_id) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total
     FROM habitaciones_ocupacion
     WHERE habitacion_id=? AND activo=1`,
    [habitacion_id]
  );
  return rows[0].total;
};

export const isPatientInRoom = async (habitacion_id, paciente_id) => {
  const [rows] = await db.query(
    `SELECT id FROM habitaciones_ocupacion
     WHERE habitacion_id=? AND paciente_id=? AND activo=1`,
    [habitacion_id, paciente_id]
  );
  return rows.length > 0;
};

export const assignRoom = async (habitacion_id, paciente_id) => {
  await db.query(
    `INSERT INTO habitaciones_ocupacion
     (habitacion_id, paciente_id, fecha_ingreso)
     VALUES (?, ?, NOW())`,
    [habitacion_id, paciente_id]
  );
};

export const updateRoomStatus = async (habitacion_id) => {
  const room = await getRoom(habitacion_id);
  const total = await countPatients(habitacion_id);

  let status = "disponible";

  if (total >= room.capacidad) {
    status = "ocupada";
  }

  await db.query(
    "UPDATE habitaciones SET estatus=? WHERE id=?",
    [status, habitacion_id]
  );
};

export const releaseByPatient = async (habitacion_id, paciente_id) => {
  await db.query(
    `UPDATE habitaciones_ocupacion
     SET activo=0, fecha_salida=NOW()
     WHERE habitacion_id=? AND paciente_id=? AND activo=1`,
    [habitacion_id, paciente_id]
  );

  return habitacion_id;
};

export const getPatientsInRoom = async (habitacion_id) => {
  const [rows] = await db.query(
    `SELECT o.id, p.id AS paciente_id, p.nombre
     FROM habitaciones_ocupacion o
     JOIN pacientes p ON o.paciente_id = p.id
     WHERE o.habitacion_id=? AND o.activo=1`,
    [habitacion_id]
  );

  return rows;
};

export const getAllOccupancy = async () => {
  const [rows] = await db.query(
    `SELECT o.id,
            h.numero AS habitacion,
            p.nombre AS paciente,
            o.fecha_ingreso,
            o.fecha_salida,
            o.activo
     FROM habitaciones_ocupacion o
     JOIN habitaciones h ON o.habitacion_id = h.id
     JOIN pacientes p ON o.paciente_id = p.id`
  );

  return rows;
};