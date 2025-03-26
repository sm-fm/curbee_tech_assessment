import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import appointmentsRouter from "./controllers/appointments";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/appointments", appointmentsRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running" });
});

export default app;
