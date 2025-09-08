import express from "express";
import {
  getUser,
  login,
  logout,
  register,
  updatePassword,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getUser);
router.put("/password/update", isAuthenticated, updatePassword);

export default router;
