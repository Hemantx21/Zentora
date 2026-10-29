import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './router/router.js';
import dbconnect from './config/db.js';
const app=express();
const PORT=process.env.PORT || 9000;
app.use(cors())///frontend se baat krne k liye 
app.use(express.json());
app.use(router);
dbconnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        })
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err)
        process.exitCode = 1
    })