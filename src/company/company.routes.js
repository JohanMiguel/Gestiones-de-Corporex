import { Router } from "express";
import { createCompany,getAllCompanies,getCompaniesByTrayectory, updateCompany} from "../company/company.controller.js";
import { saveCompanyValidators,updateCompanyValidators } from "../middlewares/company-validators.js"; 

const router = Router()

router.post("/addCategory", saveCompanyValidators, createCompany);
router.get("/", getAllCompanies);


router.get("/trayectory/menoresde/:years",getCompaniesByTrayectory);
router.get("/trayectory/mayoresA/:years",getCompaniesByTrayectory);


router.put("/editar/:companyId",updateCompanyValidators, updateCompany);

export default router;