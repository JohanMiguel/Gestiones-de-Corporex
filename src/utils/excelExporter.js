import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveExcel = (data, filename) => {
    try {
        const dirPath = path.join(__dirname, "../exports");

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, `${filename}.xlsx`);

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Empresas");
        XLSX.writeFile(workbook, filePath);

        console.log(`✅ Archivo guardado en: ${filePath}`);
        return filePath;
    } catch (error) {
        console.error("❌ Error al guardar el archivo Excel:", error);
        throw error;
    }
};
