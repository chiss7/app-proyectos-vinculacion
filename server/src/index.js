import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import projectRoutes from "./routes/project.routes.js";
import morgan from "morgan";

const app = express();

app.use(cors()); 
app.use(morgan("dev"));
app.use(express.json());

// routes
app.use("/projects", projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
