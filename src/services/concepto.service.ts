import { Types } from "mongoose";
import Concepto from "../models/concepto.model";

export const findAllConceptosFromViaje = (viaje: Types.ObjectId) => {
    return Concepto.find({viaje})
    .populate('viaje')
    .populate({
      path: 'participantes.usuario',
      model: 'User'
    })
    .populate('pagador').exec();
}

//function that returns all conceptos grouped by viaje
export const findAllConceptosGroupedByViaje = async () => {
    const conceptos = await Concepto.find()
    .populate('viaje')
    .populate({
      path: 'participantes.usuario',
      model: 'User'
    })
    .populate('pagador').exec();
    const conceptosGroupedByViaje = conceptos.reduce((acc, concepto) => {
      if (!acc[(concepto.viaje?._id as unknown as string)]) {
        acc[concepto.viaje?._id  as unknown as string] = [];
      }
      acc[concepto.viaje?._id as unknown as string].push(concepto);
      return acc;
    }, {} as any);
    return conceptosGroupedByViaje;
}

//function that returns all conceptos grouped by categoria
export const findAllConceptosGroupedByCategoria = async () => {
    const conceptos = await Concepto.find()
    .populate('viaje')
    .populate({
      path: 'participantes.usuario',
      model: 'User'
    })
    .populate('pagador').exec();
    const conceptosGroupedByCategoria = conceptos.reduce((acc, concepto) => {
      if (!acc[concepto.categoria as string]) {
        acc[concepto.categoria as string] = [];
      }
      acc[concepto.categoria as string].push(concepto);
      return acc;
    }, {} as any);
    return conceptosGroupedByCategoria;
}