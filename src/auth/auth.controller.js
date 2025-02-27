import { verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

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
/**
 * Logs in an admin user.
 * @async
 * @function loginAdmin
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
export const loginAdmin = async (req, res) => {
    const { email, username, password } = req.body
    try{
        const user = await User.findOne({
            $or:[{email: email}, {username: username}]
        })

        if(!user){
            return res.status(400).json({
                message: "Crendenciales inválidas",
                error:"No existe el usuario o correo ingresado"
            })
        }

        const validPassword = await verify(user.password, password)

        if(!validPassword){
            return res.status(400).json({
                message: "Crendenciales inválidas",
                error: "Contraseña incorrecta"
            })
        }

        const token = await generateJWT(user.id)

        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                token: token,
            }
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "login failed, server error",
            error: err.message
        })
    }
}