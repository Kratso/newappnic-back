import { model } from "mongoose";

import conceptoSchema from '../schemas/concepto.schema';

const Concepto = model('concepto', conceptoSchema);

export default Concepto;