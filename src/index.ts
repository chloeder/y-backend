import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import authRouter from "./routes/v1/auth.route";
import threadRouter from "./routes/v1/thread.route";
import userRouter from "./routes/v1/user.route";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
    origin: [
      "https://y-app-virid.vercel.app",
      "https://y-app-steward-lumowas-projects.vercel.app",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Welcome!");
});

// V1 routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/threads", threadRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
