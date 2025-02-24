import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        /**path
impact level
foundation
category*/

    },
    {
        versionKey: false,
        timestamps: true  
    }
);

const Company = mongoose.model("Company", companySchema);
export default model("Category", companySchema)