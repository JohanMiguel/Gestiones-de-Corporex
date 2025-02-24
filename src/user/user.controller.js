import { hash } from "argon2";
import User from "./user.model.js";


export const initializeAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ role: "ADMIN_ROLE" });

        if (!adminExists) {
            const hashedPassword = await hash("ADMINCorporex$sin");

            const admin = new User({
                name: "Admin",
                surname: "Corpex",
                username: "admin_role",
                email: "admin@corporex.com",
                password: hashedPassword,
                phone: "21326554",
                role: "ADMIN_ROLE",
            });

            await admin.save();
            console.log("✨ Usuario ADMIN_ROLE creado correctamente");
        }
    } catch (error) {
        console.error("❌ Error al inicializar el usuario ADMIN_ROLE:", error);
    }
};