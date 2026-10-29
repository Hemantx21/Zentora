import mongoose from "mongoose"

const dbconnect = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not set. Add it to api/.env or your deployment environment.");
    }

    const con = await mongoose.connect(uri);
    if (con) {
        console.log('database connected successfully');

    }
}
export default dbconnect