import express from "express";
import { addUser, findByCredential, generateAuthToken, getUser, updateUser, updateUser } from "../data/user.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res) => {
  const result = await addUser(req.body);
  res.send(result);
});

usersRouter.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await findByCredential(req.body.email, req.body.password);

    // generar el token
    const token = await generateAuthToken(user);
    res.send({ token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

usersRouter.get("/:id", async (req, res) => {
  const result = await getUser(req.params.id);
  res.send(result);
});

usersRouter.put("/edit", async (req, res) => {
  const result = await updateUser(req.body);
  res.send(result);
});


export default usersRouter;

// export {router}
