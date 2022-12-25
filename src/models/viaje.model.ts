import { model } from "mongoose";

import viajeSchema from '../schemas/viaje.schema';

const Viaje = model('viaje', viajeSchema);

export default Viaje;