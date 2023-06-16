import { Schema, ObjectId, Types } from "mongoose";

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
  },
  divisa: String,
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
    divisa: String,
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
    divisa: String,
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