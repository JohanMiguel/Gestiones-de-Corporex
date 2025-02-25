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
    param("companyId").isMongoId().withMessage("No es un Id valido en MongoBD2"),
    param("companyId").custom(),
    validarCampos,
    handleErrors
]