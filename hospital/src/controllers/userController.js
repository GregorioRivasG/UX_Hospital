import {
  getUsers,
  updateUser,
  deactivateUser
} from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await getUsers(search);

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, rol } = req.body;

    await updateUser(id, nombre, correo, rol);

    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deactivateUserController = async (req, res) => {
  try {
    const { id } = req.params;

    await deactivateUser(id);

    res.json({ message: "Usuario dado de baja" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};