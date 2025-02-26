import { body, param } from "express-validator";
import { validarCampos} from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";


export const saveCompanyValidators = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    validarCampos,
    handleErrors
]


export const updateCompanyValidators = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name").optional().notEmpty().withMessage("El nombre de la empresa es requerido").isLength({ max: 50 }).withMessage("El nombre no puede exceder los 50 caracteres"),
    body("fundation").optional().notEmpty().withMessage("El año de fundación es necesario").isNumeric().withMessage("El año de fundación debe ser un número válido"),
    validarCampos,
    handleErrors
]