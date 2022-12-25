import { Types } from "mongoose";
import Viaje from "../models/viaje.model"

export const findAllViajes = async () => {
    return Viaje.find().populate('participantes').populate('conceptos');
}

export const findViajeById = async (id: Types.ObjectId) => {
    return Viaje.find({id});
}