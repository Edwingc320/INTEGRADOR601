///// CARO HANDLER /////
import { Request, Response } from 'express';

import Carro from '../models/Carro.model'; // ✅

export const getCarros = async (_req: Request, res: Response) => {
  const carros = await Carro.findAll();
  res.json({ data: carros });
};

export const getCarroById = async (req: Request, res: Response) => {
  const carro = await Carro.findByPk(req.params.id);
  if (!carro) return res.status(404).json({ error: 'Carro no encontrado' });
  res.json({ data: carro });
};

export const createCarro = async (req: Request, res: Response) => {
  const carro = await Carro.create(req.body);
  res.status(201).json({ data: carro });
};

export const updateCarro = async (req: Request, res: Response) => {
  const carro = await Carro.findByPk(req.params.id);
  if (!carro) return res.status(404).json({ error: 'Carro no encontrado' });
  await carro.update(req.body);
  res.json({ data: carro });
};

export const deleteCarro = async (req: Request, res: Response) => {
  const carro = await Carro.findByPk(req.params.id);
  if (!carro) return res.status(404).json({ error: 'Carro no encontrado' });
  await carro.destroy();
  res.json({ message: 'Carro eliminado' });
};
