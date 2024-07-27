import { Router } from "express";
import ProjectController from "../controllers/project.controllers.js";

const router = Router();

router.get("/", ProjectController.getProjects);
router.post("/", ProjectController.createProject);
router.get("/:id", ProjectController.getProjectById);
router.get("/all-info/:id", ProjectController.getAllInfoProjectById);
router.delete("/:id", ProjectController.deleteProjectById);
router.patch("/:id", ProjectController.updateProjectById);

export default router;
