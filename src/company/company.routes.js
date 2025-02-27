import { Router } from "express";
import { createCompany, getAllCompanies, updateCompany, getCompaniesFiltrer } from "../company/company.controller.js";
import { saveCompanyValidators, updateCompanyValidators } from "../middlewares/company-validators.js";

const router = Router();

/**
 * @swagger
 * /addCategory:
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               impactLevel:
 *                 type: string
 *               fundation:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Company already exists
 *       500:
 *         description: Error creating company
 */
router.post("/addCategory", saveCompanyValidators, createCompany);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all companies
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: List of all companies
 *       404:
 *         description: No companies found
 *       500:
 *         description: Error retrieving companies
 */
router.get("/", getAllCompanies);

/**
 * @swagger
 * /filtros:
 *   get:
 *     summary: Get companies based on filters
 *     tags: [Company]
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: integer
 *         description: Starting index
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *         description: Limit of results
 *       - in: query
 *         name: filtro
 *         schema:
 *           type: string
 *         description: Filter type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Company category
 *       - in: query
 *         name: trayectory
 *         schema:
 *           type: integer
 *         description: Company trayectory
 *     responses:
 *       200:
 *         description: List of filtered companies
 *       500:
 *         description: Error retrieving companies
 */
router.get("/filtros", getCompaniesFiltrer);

/**
 * @swagger
 * /editar/{companyId}:
 *   put:
 *     summary: Update a company
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               impactLevel:
 *                 type: string
 *               fundation:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       404:
 *         description: Company not found
 *       500:
 *         description: Error updating company
 */
router.put("/editar/:companyId", updateCompanyValidators, updateCompany);

export default router;