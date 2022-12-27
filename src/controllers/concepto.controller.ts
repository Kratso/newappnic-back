import { NextFunction, Request, Response } from "express";

import {
  createConceptoInput,
  deleteConceptoInput,
  updateConceptoInput,
} from "../schemas/concepto.schema";
import Concepto from "../models/concepto.model";
import AppError from "../utils/appError";
import { findAllConceptosFromViaje } from "../services/concepto.service";
import mongoose from "mongoose";
import Viaje from "../models/viaje.model";

export const createConceptoHandler = async (
  req: Request<{}, {}, createConceptoInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)
    const concepto = new Concepto(req.body);

    await concepto.populate("pagador");
    await concepto.populate("viaje");    
    await concepto.populate("participantes.usuario");
    await concepto.save();

    Viaje.findByIdAndUpdate(concepto.viaje, {$push: {conceptos: concepto._id}}).exec()

    res.status(201).json({
      status: 'success',
      data: {
          concepto,
      },
  });
  } catch (err: any) {
    next(err);
  }
};

export const updateConceptoHandler = async (
  req: Request<{}, {}, updateConceptoInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {_id, ...rest} = req.body;
    const concepto = await Concepto.findByIdAndUpdate(_id, rest, {new: true}).exec();
    //populate concepto
    await concepto?.populate("pagador");
    await concepto?.populate("viaje");

    res.status(200).json({
      status: 'success',
      data: {
          concepto,
      },
  });
  } catch (err: any) {
    next(err);
  }
};

export const deleteConceptoHandler = async (
  req: Request<{}, {}, deleteConceptoInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {_id} = req.body;
    const concepto = await Concepto.findById(_id).exec();
    await Viaje.findByIdAndUpdate(concepto?.viaje, {$pull: {conceptos: _id}}).exec()

    await Concepto.findByIdAndDelete(_id).exec()


    res.status(202);
} catch(err) {
    next(err);
}
};

export const fetchConceptosFromViajeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {viajeId} = req.params
  
    const id = new mongoose.Types.ObjectId(viajeId);
    
    const conceptos = await findAllConceptosFromViaje(id);

    res.status(200).json({
      status: 'success',
      result: conceptos.length,
      data: {
        conceptos
      },
    })
  } catch(err: any) {
    next(err);
  } 
  
};
