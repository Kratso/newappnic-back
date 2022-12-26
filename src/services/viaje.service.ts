import { Types } from "mongoose";
import Viaje from "../models/viaje.model"

export const findAllViajes = async () => {
    return Viaje.find()
    .populate('participantes')
    .populate({
      path: 'conceptos',
      populate: [{
        path: 'pagador',
        model: 'User'
      }, {
        path: 'participantes.usuario',
        model: 'User'
      }]
    }).exec();
}

export const findViajeById = async (id: Types.ObjectId) => {
    return Viaje.find({id}).populate('participantes').populate('conceptos');
}