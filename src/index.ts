import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config();

const app = express();
const port = 8001;
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
    })
);
app.use(authRouter);
app.use(cookieParser())