import Company from "./company.model.js";
import { saveExcel } from "../utils/excelExporter.js";
import path from "path";

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
export const createCompany = async (req, res) => {
    try {
        const { name, impactLevel, fundation, category, description } = req.body;

        const existingCompany = await Company.findOne({ name: name.toLowerCase() });
        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: "⚠️La empresa ya está registrada"
            });
        }

        const company = new Company({
            name: name.toLowerCase(),
            impactLevel,
            fundation,
            category,
            description,
        });

        await company.save();

        res.status(201).json({
            success: true,
            message: "✅Empresa creada exitosamente",
            company
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌Error al registrar la empresa",
            error: error.message
        });
    }
};

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
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();

        if (companies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "⚠️No hay empresas registradas."
            });
        }

        const currentYear = new Date().getFullYear(); 
        const cleanData = companies.map(company => ({
            ...company.toObject(),
            _id: company._id.toString(),
            trayectory: currentYear - company.fundation 
        }));

        const filename = "reporte_empresas.xlsx";
        const filePath = saveExcel(cleanData, filename);

        res.status(200).json({
            success: true,
            message: `Datos exportados a ${filename}`,
            companies: cleanData,
            downloadUrl: `/exports/${filename}`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌Error al obtener las empresas",
            error: error.message
        });
    }
};

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
export const getCompaniesFiltrer = async (req, res) => {
    try {
        const { desde = 0, limite = 10, filtro, category, trayectory } = req.query;
        const query = {};
        const currentYear = new Date().getFullYear();

        if (category) {
            query.category = new RegExp(`^${category}$`, "i"); 
            
        }

        if (trayectory) {
            const foundationYear = currentYear - Number(trayectory);
            query.fundation = foundationYear; 
        }

        let sortOptions = {};
        switch (filtro) {
            case "trayectoria":
                sortOptions = { fundation: 1 };
                break;
            case "A-Z":
                sortOptions = { name: 1 };
                break;
            case "Z-A":
                sortOptions = { name: -1 };
                break;
            default:
                sortOptions = {};
        }

        const total = await Company.countDocuments(query);
        const companies = await Company.find(query).sort(sortOptions).skip(Number(desde)).limit(Number(limite)).lean();

        const companiesWithExperience = companies.map(company => ({
            ...company,
            trayectory: currentYear - company.fundation
        }));

        return res.status(200).json({
            success: true,
            total,
            companies: companiesWithExperience
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "❌Error al obtener las empresas",
            error: err.message
        });
    }
};

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
export const updateCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const data = req.body;

        const company = await Company.findByIdAndUpdate(companyId, data, { new: true });
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "❌Empresa no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            message: "❌Empresa actualizada exitosamente",
            company
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌Error al actualizar la empresa",
            error: error.message
        });
    }
};
