import express from "express";
import {
  getPublicacion,
  addPublicacion,
  deletePublicacion,
  updatePublicacion,
  getPublicacionesValidas,
  getPublicacionesNoValidas,
  getPublicacionByMateria,
  getPublicacionByUserId,
  validarPublicacion,
  rechazarPublicacion,
  obtenerEstadistica, 
  getPublicacionesRechazadas
} from "../data/publicaciones.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.get("/estadistica", auth, async (req, res) => {
  try {
    const estadisticas = await obtenerEstadistica();
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las estadísticas de publicaciones' });
  }
});

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



router.get("/noValidas", auth, async (req, res) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const { publicaciones, total } = await getPublicacionesNoValidas(pageSize, page);
    res.json({ publicaciones, total });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/rechazadas", auth, async (req, res) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const { publicaciones, total } = await getPublicacionesRechazadas(pageSize, page);
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
  const { reason } = req.body;
  const publicacion = await rechazarPublicacion(req.params.id, reason);
  res.json(publicacion);
});


router.get("/byUser/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  try {
    const publicacion = await getPublicacionByUserId(userId);
    res.json(publicacion);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/delete/:id", auth, async (req, res) => {
  const publicacion = await deletePublicacion(req.params.id);
  res.json(publicacion);
});

router.put("/update/:id", auth, async (req, res) => {
  
  const { telefono, precio, description, materias } = req.body;
  if (!telefono || !precio || !description || !materias || !Array.isArray(materias) || materias.length === 0) {
      return res.status(400).json({ error: "El cuerpo de la solicitud debe incluir telefono, precio, descripcion y al menos una materia" });
  }
  
  if (isNaN(Number(precio))) {
      return res.status(400).json({ error: "El campo 'precio' debe ser numérico." });
  }
  
  if (description.trim() === "") {
      return res.status(400).json({ error: "El campo 'description' no puede estar vacío." });
  }
  
  try {
      const publicacion = await updatePublicacion(req.body);
      res.status(200).json({ status: "success", publicacion });
  } catch (error) {
      res.status(500).json({ error: "Hubo un error al actualizar la publicación. Inténtelo de nuevo más tarde." });
  }
});

export default router;
