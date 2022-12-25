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
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      pagado: Boolean,
    },
  ],
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