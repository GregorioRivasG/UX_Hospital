import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("HEADER:", req.headers.authorization);
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const token = header.startsWith("Bearer ")
    ? header.split(" ")[1]
    : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
};