import express from "express";
import { signin, signup } from "../controller/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);

router.get("/verify", authenticateUser, (req, res) => {
  res.status(200).json({ message: "Token is valid." });
});

export default router;
