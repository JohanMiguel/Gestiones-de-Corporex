import { Router } from "express";
import { createCompany,getAllCompanies, updateCompany, getCompaniesFiltrer} from "../company/company.controller.js";
import { saveCompanyValidators,updateCompanyValidators } from "../middlewares/company-validators.js"; 

const router = Router()

router.post("/addCategory", saveCompanyValidators, createCompany);
router.get("/", getAllCompanies);
router.get("/filtros", getCompaniesFiltrer);
router.put("/editar/:companyId",updateCompanyValidators, updateCompany);

export default router;