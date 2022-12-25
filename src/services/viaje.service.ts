import { Types } from "mongoose";
import Viaje from "../models/viaje.model"

export const findAllViajes = async () => {
    return Viaje.find();
}

export const findViajeById = async (id: Types.ObjectId) => {
    return Viaje.find({id});
}