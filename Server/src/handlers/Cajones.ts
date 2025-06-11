import { Request, Response } from 'express';
import  Cajones  from '../models/Cajones.model';

export const getCajones = async (_req: Request, res: Response) => {
  const cajones = await Cajones.findAll();
  res.json({ data: cajones });
};

export const getCajonById = async (req: Request, res: Response) => {
  const cajon = await Cajones.findByPk(req.params.id);
  if (!cajon) return res.status(404).json({ error: 'Cajón no encontrado' });
  res.json({ data: cajon });
};

export const createCajon = async (req: Request, res: Response) => {
  const cajon = await Cajones.create(req.body);
  res.status(201).json({ data: cajon });
};
export const getCajonesDisponibles = async (_req: Request, res: Response) => {
  const cajones = await Cajones.findAll({
    where: { estado: 'libre' },
  });
  res.json({ data: cajones });
};

export const updateCajon = async (req: Request, res: Response) => {
  const cajon = await Cajones.findByPk(req.params.id);
  if (!cajon) return res.status(404).json({ error: 'Cajón no encontrado' });
  await cajon.update(req.body);
  res.json({ data: cajon });
};

export const deleteCajon = async (req: Request, res: Response) => {
  const cajon = await Cajones.findByPk(req.params.id);
  if (!cajon) return res.status(404).json({ error: 'Cajón no encontrado' });
  await cajon.destroy();
  res.json({ message: 'Cajón eliminado' });
};
