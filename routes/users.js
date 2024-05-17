import express from "express";
import { addUser, findByCredential, generateAuthToken } from "../data/user.js";

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

export default usersRouter;

// export {router}
