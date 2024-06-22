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

export async function validarPublicacion(id) {
  const clientmongo = await getConnection();
  const query = { _id: new ObjectId(id) };
  const newValues = {
    $set: {
      validate: true
    },
    $unset: {
      edited: "",
      rejected: ""
    }
  };

  const result = await clientmongo
    .db("eduwave")
    .collection("publicaciones")
    .updateOne(query, newValues);
  return result;
}

export async function rechazarPublicacion(id) {
  const clientmongo = await getConnection();
  const query = { _id: new ObjectId(id) };
  const newValues = {
    $set: {
      rejected: true
    },
    $unset: {
      edited: "",
      validate: ""
    }
  };

  const result = await clientmongo
    .db("eduwave")
    .collection("publicaciones")
    .updateOne(query, newValues);
  return result;
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

export async function getPublicacionesValidas(pageSize, page, materia) {
  const clientmongo = await getConnection();

  const skip = (page - 1) * pageSize;

  const pipeline = [
    {
      $match: { validate: true }
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_info"
      }
    },
    {
      $unwind: "$user_info"
    },
    {
      $project: {
        _id: 1,
        description: 1,
        username: "$user_info.username",
        materias: 1,
        precio: 1,
        telefono: 1,
      }
    },
    {
      $skip: skip
    },
    {
      $limit: pageSize
    }
  ];

  if (materia) {
    pipeline.unshift({
      $match: { materias: materia }
    });
  }

  const publicaciones = await clientmongo
    .db("eduwave")
    .collection("publicaciones")
    .aggregate(pipeline)
    .toArray();

  // Ajusta la cuenta total para tener en cuenta el filtro de materia
  const totalMatch = { validate: true };
  if (materia) {
    totalMatch.materias = materia;
  }

  const total = await clientmongo
    .db("eduwave")
    .collection("publicaciones")
    .countDocuments(totalMatch);

  return { publicaciones, total };
}


export async function getPublicacionesNoValidas(pageSize, page) {
  const clientmongo = await getConnection();

  const skip = (page - 1) * pageSize;

  const pipeline = [
    {
      $match: { validate: false }
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_info"
      }
    },
    {
      $unwind: "$user_info"
    },
    {
      $project: {
        _id: 1,
        description: 1,
        username: "$user_info.username",
        materias: 1,
        precio: 1,
        telefono: 1,
      }
    },
    {
      $skip: skip
    },
    {
      $limit: pageSize
    }
  ];
  const publicaciones = await clientmongo
    .db("eduwave")
    .collection("publicaciones")
    .aggregate(pipeline)
    .toArray();

  const totalMatch = { validate: false };


  const total = await clientmongo
    .db("eduwave")
    .collection("publicaciones")
    .countDocuments(totalMatch);

  return { publicaciones, total };
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

  publicacion.validate = false;
  publicacion.user_id = new ObjectId(publicacion.user_id);
  const result = await clientmongo
    .db("eduwave")
    .collection("publicaciones")
    .insertOne(publicacion);

  return result;
}

export async function updatePublicacion(publicacion) {
  const clientmongo = await getConnection();
  const query = { _id: new ObjectId(publicacion._id) };
  const newValues = {
    $set: {
      description: publicacion.description,
      materias: publicacion.materias,
      precio: publicacion.precio,
      telefono: publicacion.telefono,
      validate: false,
      edited: true
    },
  };

  const result = await clientmongo
    .db("eduwave")
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
