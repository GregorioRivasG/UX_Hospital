import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import occupancyRoutes from "./routes/occupancyRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import medicamentoRoutes from "./routes/medicamentoRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import laboratorioRoutes from "./routes/laboratorioRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

//inicio de sesion y registrar usuarios
app.use("/api/auth", authRoutes);

//gestion de usuarios
app.use("/api", userRoutes);

//gestion de medicos
app.use("/api", doctorRoutes);

//gestion de los pacientes
app.use("/api", patientRoutes);

//gestion de citas
app.use("/api", appointmentRoutes);

//gestion de habitaciones
app.use("/api/habitaciones", roomRoutes);

//gestion de hatitaciones ocupadas
app.use("/api/ocupacion", occupancyRoutes);

//gestion de farmacia
app.use("/api", medicamentoRoutes);

//gestion de almacen
app.use("/api", materialRoutes);

//emergencias
app.use("/api", emergencyRoutes);

//gestion laboratorio
app.use("/api", laboratorioRoutes);

export default app;