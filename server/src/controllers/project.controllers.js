import { pool } from "../db.js";

const ProjectController = {
  getProjects: async (req, res) => {
    try {
      const { rows } = await pool.query("SELECT * FROM proyecto");
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting projects." });
    }
  },
  getProjectById: async (req, res) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM get_proyecto_by_id($1)",
        [req.params.id]
      );
      if (rows.length === 0) {
        res.status(404).json({ message: "Project not found." });
      } else {
        res.status(200).json(rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting project." });
    }
  },
  getAllInfoProjectById: async (req, res) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM get_all_info_project_by_id($1) AS info_project",
        [req.params.id]
      );
      if (!rows[0].info_project) {
        res.status(404).json({ message: "Project not found." });
      } else {
        res.status(200).json(rows[0].info_project);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting project." });
    }
  },
  getAllInfoProjects: async (req, res) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM get_all_info_projects() AS info_projects"
      );
      res.status(200).json(rows[0].info_projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting project." });
    }
  },
  createProject: (req, res) => {
    res.send("Create project!");
  },
  deleteProjectById: async (req, res) => {
    try {
      await pool.query("BEGIN");
      const result = await pool.query(
        "SELECT delete_proyecto_by_id($1) AS project_deleted",
        [req.params.id]
      );
      await pool.query("COMMIT");
      if (result.rows[0].project_deleted) {
        res.sendStatus(204);
      } else {
        res.status(404).json({ message: "Project not found." });
      }
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error(error);
      res.status(500).json({ message: "Error deleting project." });
    }
  },
  updateProjectById: (req, res) => {
    res.send(`Updating project ${req.params.id}`);
  },
};

export default ProjectController;
