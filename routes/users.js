import express from "express";
import { addUser, findByCredential, generateAuthToken, getUser, updateUser } from "../data/user.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res) => {
  try {
    const result = await addUser(req.body);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

usersRouter.post("/login", async (req, res) => {
  try {
    const user = await findByCredential(req.body.email, req.body.password);
    const token = await generateAuthToken(user);
    res.send({ token, user });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

usersRouter.put("/edit", async (req, res) => {
  const result = await updateUser(req.body);
  res.send(result);
});

usersRouter.get("/:id", async (req, res) => {
  const result = await getUser(req.params.id);
  res.send(result);
});

export default usersRouter;

// export {router}
