import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const companySchema = new Schema({
        name: {
            type: String,
            required: [true, "Company name is required"],
            unique: true,
            trim: true
        },
        impactLevel: {
            type: String,
            required: [true, "Impact level is required"],
            enum: ["Low", "Medium", "High"]
        },
        fundation: {
            type: Number, 
            required: [true, "Año de fundación is required"]
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true
    },
    },
    {
        versionKey: false,
        timestamps: true 
    }
);

export default model("Company", companySchema);