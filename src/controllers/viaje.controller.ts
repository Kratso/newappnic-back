import { NextFunction, Request, Response } from "express";

import {
  createViajeInput,
  deleteViajeInput,
  updateViajeInput,
} from "../schemas/viaje.schema";
import Viaje from "../models/viaje.model";
import AppError from "../utils/appError";
import { findAllViajes, findViajeById } from "../services/viaje.service";
import mongoose from "mongoose";
import userModel from "../models/user.model";
import { findUserById } from "../services/user.service";
import Concepto from "../models/concepto.model";

export const createViajeHandler = async (
  req: Request<{}, {}, createViajeInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(mongoose.models);

    const viaje = new Viaje(req.body);

    await viaje.populate("participantes");
    await viaje.populate("conceptos");
    await viaje.save();

    res.status(201).json({
      status: "success",
      data: {
        viaje,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateViajeHandler = async (
  req: Request<{}, {}, updateViajeInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, destino, participantes, conceptos, start_date, end_date } =
      req.body;
    const viaje = await Viaje.findById(_id).exec();
    if (!viaje) {
      return next(new AppError("invalid viaje _id"));
    }

    viaje.destino = destino;
    viaje.participantes = participantes;
    viaje.conceptos = conceptos;
    viaje.start_date = start_date;
    viaje.end_date = end_date;

    await viaje.populate("participantes");
    await viaje.populate("conceptos");
    await viaje.save();

    res.status(201).json({
      status: "success",
      data: {
        viaje,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteViajeHandler = async (
  req: Request<{}, {}, deleteViajeInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.body;

    await Viaje.findByIdAndDelete(_id).exec();

    // drop all conceptos from viaje
    await Concepto.updateMany(
      { viaje: _id },
      { $pull: { viajes: _id } }
    ).exec();

    res.status(202);
  } catch (err) {
    next(err);
  }
};

export const fetchViajesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let viajes = await findAllViajes();
    
    viajes.forEach(a=> a.conceptos.forEach((b: any) => console.log(b.participantes)));
    res.status(200).json({
      status: "success",
      result: viajes.length,
      data: {
        viajes,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const fetchViajeByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { viajeId } = req.params;

    const id = new mongoose.Types.ObjectId(viajeId);

    const viaje = await findViajeById(id);

    res.status(200).json({
      status: "success",
      result: 1,
      data: {
        viaje,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
