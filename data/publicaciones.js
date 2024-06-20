import { ObjectId } from "mongodb";
import getConnection from "./connection.js";

export async function getPublicaciones() {
  const clientmongo = await getConnection();

  const publicaciones = await clientmongo
    .db()
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
    .db()
    .collection("publicaciones")
    .find({ validado: true })
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
