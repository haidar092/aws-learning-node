import express from "express";
import {
  createStudent,
  getStudents,
  getStudentDetails,
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/details", getStudentDetails); // 🔥 aggregation route

export default router;
