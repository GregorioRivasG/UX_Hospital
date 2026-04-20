import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByCorreo, createUser } from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await createUser(nombre, correo, hashed, rol);

    res.json({ message: "Usuario registrado" });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const user = await findUserByCorreo(correo);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.activo) {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      rol: user.rol,
      nombre: user.nombre
    });

  } catch (err) {
    console.log("ERROR LOGIN:", err);
    res.status(500).json({ error: err.message });
  }
};
