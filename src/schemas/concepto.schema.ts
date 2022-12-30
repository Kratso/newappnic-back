import { Schema, ObjectId, Types } from "mongoose";
import { string } from "zod";

const conceptoSchema = new Schema({
  titulo: String,
  fecha: Date,
  pagador: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  participantes: [
    {
      usuario: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      pagado: Boolean,
    },
  ],
  categoria: String,
  unidades: Number,
  precio: Number,
  viaje: {
      type: Schema.Types.ObjectId,
      ref: "viaje",
  }
});

interface createConceptoInput {
    title: String,
    fecha: Date,
    pagador: ObjectId,
    participantes: Types.ObjectId[],
    unidades: Number,
    precio: Number,
    categoria: String,
    viaje: Types.ObjectId,
}

interface updateConceptoInput {
    _id: ObjectId,
    title: String,
    fecha: Date,
    pagador: ObjectId,
    participantes: Types.ObjectId[],
    unidades: Number,
    precio: Number,
    categoria: String,
    viaje: Types.ObjectId,
}

interface deleteConceptoInput {
    _id: ObjectId,
}

export default conceptoSchema;

export {
    createConceptoInput,
    updateConceptoInput,
    deleteConceptoInput,
}