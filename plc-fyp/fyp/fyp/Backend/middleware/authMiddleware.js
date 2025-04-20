import jwt from "jsonwebtoken";
import { findUserByEmail } from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByEmail(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found." });

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};
