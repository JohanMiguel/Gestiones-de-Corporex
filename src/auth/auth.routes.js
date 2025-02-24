import { Router } from "express"
import { loginAdmin} from "./auth.controller.js"
import {  loginValidator } from "../middlewares/user-validators.js"

const router = Router()


router.post("/login",loginValidator,loginAdmin)

export default router