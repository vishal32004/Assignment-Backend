import express from "express";
import authRouter from "./routes/authRouter";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter";
import { authenticate } from "./middleware/authMiddleware";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();

interface UserBasicInfo {
    id: number;
    name: string;
    email: string;
    roles: string[];
}
declare global {
    namespace Express {
        interface Request {
            user?: UserBasicInfo | null;
        }
    }
}

const app = express();
const port = 8001;
app.use(helmet());

app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
    })
);

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(authRouter);
app.use("/users", authenticate, userRouter);


app.use(errorHandler);


