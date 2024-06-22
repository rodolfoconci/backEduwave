import express from "express";
import { addUser, findByCredential, generateAuthToken, getUser, updateUser } from "../data/user.js";
import auth from "../middleware/auth.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).send({ error: 'Faltan campos obligatorios: se requieren nombre, apellido, contraseña y email.' });
    }
    const result = await addUser(req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

usersRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: 'Faltan campos obligatorios: se requieren email y contraseña.' });
    }
    const user = await findByCredential(email, password);
    const token = await generateAuthToken(user);
    res.status(200).send({ token, user });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

usersRouter.put("/edit", auth, async (req, res) => {
  try {
    const result = await updateUser(req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

usersRouter.get("/:id", auth, async (req, res) => {
  try {
    const result = await getUser(req.params.id);
    if (!result) {
      return res.status(404).send({ error: 'El usuario no existe.' });
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default usersRouter;