import Company from "./company.model.js";
import { saveExcel } from "../utils/excelExporter.js";
import path from "path";

export const createCompany = async (req, res) => {
    try {
        const { name, impactLevel, trayectory, category, description } = req.body;

        const existingCompany = await Company.findOne({ name: name.toLowerCase() });
        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: "La empresa ya está registrada"
            });
        }

        const company = new Company({
            name: name.toLowerCase(),
            impactLevel,
            trayectory,
            category,
            description,
        });

        await company.save();

        res.status(201).json({
            success: true,
            message: "Empresa creada exitosamente",
            company
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al registrar la empresa",
            error: error.message
        });
    }
};

export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json({
            success: true,
            companies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las empresas",
            error: error.message
        });
    }
};

export const getCompanyByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params;

        const companies = await Company.find({ category: { $regex: new RegExp(`^${categoryName}$`, "i") } });

        if (companies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron empresas en esta categoría."
            });
        }

        const cleanData = companies.map(company => company.toObject());

        const filename = `empresas_categoria_${categoryName.toLowerCase()}.xlsx`;
        const filePath = saveExcel(cleanData, filename);

        res.status(200).json({
            success: true,
            message: `Datos exportados a ${filename}`,
            companies,
            downloadUrl: `/exports/${filename}`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al filtrar empresas por categoría",
            error: error.message
        });
    }
};

export const getCompaniesByTrayectory = async (req, res) => {
    try {
        const { years, condition } = req.params;
        const filter = condition === "menores"
            ? { trayectory: { $lt: parseInt(years) } }  
            : { trayectory: { $gt: parseInt(years) } }; 

        const companies = await Company.find(filter);
        
        if (companies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron empresas con esa trayectoria."
            });
        }

        const cleanData = companies.map(company => company.toObject());

        const filename = `empresas_trayectoria_${condition}_${years}.xlsx`;
        const filePath = saveExcel(cleanData, filename);

        res.status(200).json({
            success: true,
            message: `Datos exportados a ${filename}`,
            companies,
            downloadUrl: `/exports/${filename}`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al filtrar empresas por trayectoria",
            error: error.message
        });
    }
};

export const getAllCompaniesSorted = async (req, res) => {
    try {
        const { order } = req.params;

        const sortOrder = order.toLowerCase() === "az" ? 1 : -1;

        const companies = await Company.find().sort({ name: sortOrder });

        if (companies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron empresas."
            });
        }

        const cleanData = companies.map(company => company.toObject());

        const filename = `empresas_orden_${order.toLowerCase()}.xlsx`;
        const filePath = saveExcel(cleanData, filename);

        res.status(200).json({
            success: true,
            message: `Datos exportados a ${filename}`,
            companies,
            downloadUrl: `/exports/${filename}`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al listar empresas ordenadas",
            error: error.message
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
                message: "Empresa no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            message: "Empresa actualizada exitosamente",
            company
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la empresa",
            error: error.message
        });
    }
};

