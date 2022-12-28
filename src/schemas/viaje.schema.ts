import { Schema, ObjectId, Types } from "mongoose";

const viajeSchema = new Schema({
    destino: String,
    start_date: Date,
    end_date: Date,
    participantes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    conceptos: [{type: Schema.Types.ObjectId, ref: 'concepto'}],
    contable: {type: Schema.Types.ObjectId, ref: 'User'},
})

interface createViajeInput {
    destino: string,
    start_date: Date,
    end_date: Date,
    participantes: Types.ObjectId[],
    conceptos: Types.ObjectId[],
    contable: Types.ObjectId,
}

interface updateViajeInput {
    _id: ObjectId
    destino: string,
    start_date: Date,
    end_date: Date,
    participantes: Types.ObjectId[],
    conceptos: Types.ObjectId[],
    contable: Types.ObjectId,
}

interface deleteViajeInput {
    _id: ObjectId,
}

export default viajeSchema;
export {
    createViajeInput,
    updateViajeInput,
    deleteViajeInput,
}
