import { ObjectId } from "mongodb";
import getConnection from "./connection.js";

export async function getPublicaciones() {
  const clientmongo = await getConnection();

  const publicaciones = await clientmongo
    .db("eduwave")
    .collection("publicaciones")
    .find()
    .toArray();
  return publicaciones;
}

export async function getPublicacionByMateria(materia){
  const connectiondb = await getConnection();
  const publicaciones = await connectiondb
    .db()
    .collection("publicaciones")
    .find({ "materia": materia})
    .toArray();
  return publicaciones;
}

export async function getPublicacionesValidas() {
  const clientmongo = await getConnection();

  const publicaciones = await clientmongo
      .db("eduwave")
      .collection("publicaciones")
      .aggregate([
          {
              $match: { validate: true }
          },
          {
              $lookup: {
                  from: "users", // La colección de usuarios
                  localField: "user_id", // Campo en publicaciones
                  foreignField: "_id", // Campo en usuarios
                  as: "user_info" // Nombre del campo para la información combinada
              }
          },
          {
              $unwind: "$user_info" // Desenrolla el array resultante de la combinación
          },
          {
              $project: {
                  _id: 1,
                  description: 1,
                  username: "$user_info.username", // Cambia según el nombre del campo en tu colección de usuarios
                  materias: 1,
                  precio: 1,
                  telefono: 1,
              }
          }
      ])
      .toArray();

  return publicaciones;
}

export async function getPublicacionesNoValidas() {
  const clientmongo = await getConnection();

  const publicaciones = await clientmongo
    .db()
    .collection("publicaciones")
    .find({ validado: false })
    .toArray();
  return publicaciones;
}

export async function getPublicacionesByUserId(user_id) {
  const clientmongo = await getConnection();

  const publicaciones = await clientmongo
    .db("eduwave")
    .collection("publicaciones")
    .findOne({ user_id: new ObjectId(user_id) });
  return publicaciones;
}

export async function getPublicacion(id) {
  const clientmongo = await getConnection();
  const publicacion = await clientmongo
    .db()
    .collection("publicaciones")
    .findOne({ _id: new ObjectId(id) });

  return publicacion;
}

export async function addPublicacion(publicacion) {
  const clientmongo = await getConnection();

  const result = await clientmongo
    .db()
    .collection("publicaciones")
    .insertOne(publicacion);

  return result;
}

export async function updatePublicacion(publicacion) {
  const clientmongo = await getConnection();
  const query = { _id: new ObjectId(publicacion._id) };
  const newValues = {
    $set: {
      descripcion: publicacion.descripcion,
      materias: publicacion.materias,
      user: publicacion.user,
      precio: publicacion.precio
    },
  };

  const result = await clientmongo
    .db()
    .collection("publicaciones")
    .updateOne(query, newValues);
  return result;
}

export async function deletePublicacion(id) {
  const clientmongo = await getConnection();

  const result = await clientmongo
    .db()
    .collection("publicaciones")
    .deleteOne({ _id: new ObjectId(id) });
  return result;
}
