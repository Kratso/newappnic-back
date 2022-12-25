import { Types } from "mongoose";
import Concepto from "../models/concepto.model";

export const findAllConceptosFromViaje = (viaje: Types.ObjectId) => () => {
    return Concepto.find({viaje}).populate('viaje').populate('participantes.user').populate('pagador');
}