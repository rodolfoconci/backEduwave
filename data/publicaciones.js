import { ObjectId } from "mongodb";
import getConnection from "./connection.js";

const DATABASE = process.env.DATABASE;
const COLLECTION = process.env.PUBLICACIONES_COLLECTION;

export async function getPublicaciones() {
  const clientmongo = await getConnection();

  const publicaciones = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
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
      rejected: "",
      reason: ""
    }
  };

  const result = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
    .updateOne(query, newValues);
  return result;
}

export async function rechazarPublicacion(id, reason) {
  const clientmongo = await getConnection();
  const query = { _id: new ObjectId(id) };
  const newValues = {
    $set: {
      rejected: true,
      reason: reason
    },
    $unset: {
      edited: "",
      validate: ""
    }
  };

  const result = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
    .updateOne(query, newValues);
  return result;
}

export async function getPublicacionByMateria(materia){
  const connectiondb = await getConnection();
  const publicaciones = await connectiondb
    .db(DATABASE)
    .collection(COLLECTION)
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
    .db(DATABASE)
    .collection(COLLECTION)
    .aggregate(pipeline)
    .toArray();

  // Ajusta la cuenta total para tener en cuenta el filtro de materia
  const totalMatch = { validate: true };
  if (materia) {
    totalMatch.materias = materia;
  }

  const total = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
    .countDocuments(totalMatch);

  return { publicaciones, total };
}


export async function getPublicacionesNoValidas(pageSize, page) {
  const clientmongo = await getConnection();

  const skip = (page - 1) * pageSize;

  const pipeline = [
    {
      $match: {
        $or: [
          { validate: false },
          { edited: true }
        ]
      }
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
    .db(DATABASE)
    .collection(COLLECTION)
    .aggregate(pipeline)
    .toArray();

  const totalMatch = {
    $or: [
      { validate: false },
      { edited: true }
    ]
  };

  const total = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
    .countDocuments(totalMatch);

  return { publicaciones, total };
}

export async function getPublicacionesRechazadas(pageSize, page) {
  const clientmongo = await getConnection();

  const skip = (page - 1) * pageSize;

  const pipeline = [
    {
      $match: {
        rejected: true 
      }
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
        reason: 1
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
    .db(DATABASE)
    .collection(COLLECTION)
    .aggregate(pipeline)
    .toArray();

  const totalMatch = {
      rejected: true
  };

  const total = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
    .countDocuments(totalMatch);

  return { publicaciones, total };
}

export async function getPublicacionByUserId(user_id) {
  const clientmongo = await getConnection();

  const publicacion = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
    .findOne({ user_id: new ObjectId(user_id) });
  return publicacion;
}

export async function getPublicacion(id) {
  const clientmongo = await getConnection();
  const publicacion = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  return publicacion;
}

export async function addPublicacion(publicacion) {
  const clientmongo = await getConnection();

  publicacion.validate = false;
  publicacion.user_id = new ObjectId(publicacion.user_id);
  const result = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
    .insertOne(publicacion);

  return result;
}

export async function obtenerEstadistica(){
  const clientmongo = await getConnection();
  const db = clientmongo.db(DATABASE);
  const collection = db.collection(COLLECTION);

  const validadas = await collection.countDocuments({ validate: true });
  const rechazadas = await collection.countDocuments({ rejected: true });
  const noValidadas = await collection.countDocuments({ validate: false }) + await collection.countDocuments({ edited: true });
  const total = await collection.countDocuments();

  return {
    validadas:validadas,
    rechazadas:rechazadas,
    noValidadas:noValidadas,
    total:total
  };
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
      edited: true
    },
    $unset: {
      validate: "",
      rejected: "",
      reason: ""
    }
  };

  const result = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
    .updateOne(query, newValues);
  return result;
}

export async function deletePublicacion(id) {
  const clientmongo = await getConnection();

  const result = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result;
}
