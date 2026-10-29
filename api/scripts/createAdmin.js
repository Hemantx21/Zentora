import "dotenv/config";
import mongoose from "mongoose";
import dbconnect from "../config/db.js";
import { masterPlanModel, userModel } from "../model/model.js";

const name = process.env.ADMIN_NAME?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!name || !email || !password) {
    console.error("Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before running npm run create-admin.");
    process.exit(1);
}

if (password.length < 8 || password.length > 18) {
    console.error("ADMIN_PASSWORD must be between 8 and 18 characters to match the login form.");
    process.exit(1);
}

try {
    await dbconnect();

    const existingAccount = await userModel.findOne({ email });
    if (existingAccount && existingAccount.type !== "admin") {
        throw new Error("That email already belongs to a non-admin account. Choose a different ADMIN_EMAIL.");
    }

    if (!existingAccount) {
        await new userModel({ name, email, password, type: "admin", credit: 0 }).save();
        console.log(`Admin account created for ${email}.`);
    } else {
        console.log(`Admin account already exists for ${email}; it was not changed.`);
    }

    if (await masterPlanModel.countDocuments() === 0) {
        await new masterPlanModel({
            name: "Starter Demo",
            price: "0",
            credits: "10",
            tagline: "Development credit pack; no payment is processed.",
            features: "10 bidding credits",
            popular: false
        }).save();
        console.log("Added a 10-credit Starter Demo plan so freelancers can test bidding.");
    }
} catch (err) {
    console.error("Admin setup failed:", err.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
