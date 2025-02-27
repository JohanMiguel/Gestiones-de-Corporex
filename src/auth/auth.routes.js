import { Router } from "express";
import { loginAdmin } from "./auth.controller.js";
import { loginValidator } from "../middlewares/user-validators.js";

const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs in an admin user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", loginValidator, loginAdmin);

export default router;