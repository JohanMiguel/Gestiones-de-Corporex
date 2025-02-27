import Company from "./company.model.js";
import { saveExcel } from "../utils/excelExporter.js";
import path from "path";

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
