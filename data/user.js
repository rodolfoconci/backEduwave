import getConnection from "./connection.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function addUser(user) {
  const clientmongo = await getConnection();

  // TODO Validar si el usuario existe
  user.password = await bcryptjs.hash(user.password, 10);

  const result = clientmongo
    .db("sample_tp2")
    .collection("users")
    .insertOne(user);

  return result;
}

export async function findByCredential(email, password) {
  const clientmongo = await getConnection();

  const user = await clientmongo
    .db("sample_tp2")
    .collection("users")
    .findOne({ email: email });

  if (!user) {
    throw new Error("Credenciales no validas");
  }

  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Credenciales no validas");
  }

  return user;
}

export async function generateAuthToken(user) {
  const token = await jwt.sign(
    { _id: user._id, email: user.email },
    process.env.CLAVE_SECRETA,
    { expiresIn: "1h" }
  );
  return token;
}
