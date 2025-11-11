import express from "express";
import { createCity, getCities } from "../controllers/cityController.js";

const router = express.Router();

router.post("/", createCity);
router.get("/", getCities);

export default router;
