import { Request, Response } from 'express';
import  Pago  from '../models/Pago.model';
import Ocupacion from '../models/Ocupacion.model';


export const getPagos = async (_req: Request, res: Response) => {
  const pagos = await Pago.findAll();
  res.json({ data: pagos });
};

export const getPagoById = async (req: Request, res: Response) => {
  const pago = await Pago.findByPk(req.params.id);
  if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
  res.json({ data: pago });
};

export const createPago = async (req: Request, res: Response) => {
  const pago = await Pago.create(req.body);
  res.status(201).json({ data: pago });
};

export const crearPagoYActualizarOcupacion = async (req: Request, res: Response) => {
  try {
    const pago = await Pago.create(req.body); // guarda id_ocupacion

    if (req.body.id_ocupacion) {
      await Ocupacion.update(
        { id_pago: pago.id_pago, estado: 'pagado' },
        { where: { id_ocupacion: req.body.id_ocupacion } }
      );
    }

    res.status(201).json({ data: pago });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el pago' });
  }
};


export const updatePago = async (req: Request, res: Response) => {
  const pago = await Pago.findByPk(req.params.id);
  if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
  await pago.update(req.body);
  res.json({ data: pago });
};

export const deletePago = async (req: Request, res: Response) => {
  const pago = await Pago.findByPk(req.params.id);
  if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
  await pago.destroy();
  res.json({ message: 'Pago eliminado' });
};
