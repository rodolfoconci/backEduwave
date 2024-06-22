import express from "express";
import {
  getPublicaciones,
  getPublicacion,
  addPublicacion,
  deletePublicacion,
  updatePublicacion,
  getPublicacionesValidas,
  getPublicacionesNoValidas,
  getPublicacionByMateria,
  getPublicacionesByUserId,
  validarPublicacion,
  rechazarPublicacion
} from "../data/publicaciones.js";
import auth from "../middleware/auth.js";


const router = express.Router();

/* router.get("/", async (req, res) => {
  const publicacion = await getPublicaciones();
  res.json(publicacion);
}); */

router.get("/validas", async (req, res) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const materia = req.query.materia || null;
    const { publicaciones, total } = await getPublicacionesValidas(pageSize, page, materia);
    res.json({ publicaciones, total });
  } catch (error) {
    res.status(500).send(error.message);
  }
});



router.post("/publicar", auth, async (req, res) => {
  const publicacion = req.body;
  const result = await addPublicacion(publicacion);
  res.json(result);
});

router.get("/byMateria", auth, async (req, res) => {
  const materia = req.query.materia;
  const publicaciones = await getPublicacionByMateria(materia);
  res.json(publicaciones);
});



router.get("/noValidas", async (req, res) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const { publicaciones, total } = await getPublicacionesNoValidas(pageSize, page);
    res.json({ publicaciones, total });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  const publicacion = await getPublicacion(req.params.id);
  res.json(publicacion);
});

router.put("/validar/:id", auth, async (req, res) => {
  const publicacion = await validarPublicacion(req.params.id);
  res.json(publicacion);
});

router.put("/rechazar/:id", auth, async (req, res) => {
  const publicacion = await rechazarPublicacion(req.params.id);
  res.json(publicacion);
});


router.get("/byUser/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  try {
    const publicaciones = await getPublicacionesByUserId(userId);
    res.json(publicaciones);
    
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/:id/delete", auth, async (req, res) => {
  const publicacion = await deletePublicacion(req.params.id);
  res.json(publicacion);
});

router.put("/:id/update", auth, async (req, res) => {
  const publicacion = await updatePublicacion(req.body);
  res.json(publicacion);
});
// router.put
// router.delete

export default router;
