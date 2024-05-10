import express from "express";
import {
  getInventor,
  getInventors,
  addInventor,
  deleteInventor,
  updateInventor,
} from "../data/inventor.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const inventors = await getInventors();
  res.json(inventors);
});

router.get("/:id", async (req, res) => {
  const inventor = await getInventor(req.params.id);
  res.json(inventor);
});

router.post("/", async (req, res) => {
  const inventor = req.body;
  const result = await addInventor(inventor);
  res.json(result);
});

// router.put
// router.delete

export default router;
