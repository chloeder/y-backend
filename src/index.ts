import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import authRouter from "./routes/v1/auth.route";
import threadRouter from "./routes/v1/thread.route";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Welcome!");
});

// V1 routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/threads", threadRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
