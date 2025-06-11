import { Request, Response } from 'express';
import  Ocupacion  from '../models/Ocupacion.model';
import Cajones from '../models/Cajones.model';

export const getOcupaciones = async (_req: Request, res: Response) => {
  const ocupaciones = await Ocupacion.findAll();
  res.json({ data: ocupaciones });
};

export const getOcupacionById = async (req: Request, res: Response) => {
  const ocupacion = await Ocupacion.findByPk(req.params.id);
  if (!ocupacion) return res.status(404).json({ error: 'Ocupación no encontrada' });
  res.json({ data: ocupacion });
};

export const createOcupacion = async (req: Request, res: Response) => {
  const ocupacion = await Ocupacion.create(req.body);

  // marcar el cajón como ocupado
  await Cajones.update({ Estado: 'ocupado' }, { where: { id_cajon: req.body.id_cajon } });

  res.status(201).json({ data: ocupacion });
};

export const updateOcupacion = async (req: Request, res: Response) => {
  const ocupacion = await Ocupacion.findByPk(req.params.id);
  if (!ocupacion) return res.status(404).json({ error: 'Ocupación no encontrada' });
  await ocupacion.update(req.body);
  res.json({ data: ocupacion });
};

export const deleteOcupacion = async (req: Request, res: Response) => {
  const ocupacion = await Ocupacion.findByPk(req.params.id);
  if (!ocupacion) return res.status(404).json({ error: 'Ocupación no encontrada' });
  await ocupacion.destroy();
  res.json({ message: 'Ocupación eliminada' });
};


export const getOcupacionesByCliente = async (req: Request, res: Response): Promise<void> => {
  const { id_cliente } = req.params;
  try {
    const ocupaciones = await Ocupacion.findAll({
       where: {
        id_cliente,
        estado: 'reservado'  // <-- aquí filtras solo las reservadas
      },
      order: [
        // Ya no hace falta ordenar por estado porque todos son 'reservado'
        ['fecha_reservacion', 'DESC']  // primero las más recientes
      ],
    });

    if (!ocupaciones || ocupaciones.length === 0) {
      res.status(404).json({ message: 'No se encontraron ocupaciones para este cliente' });
      return;  // Termina la función aquí para evitar enviar respuesta dos veces
    }

    res.json(ocupaciones); // ✅ Enviamos TODAS las ocupaciones
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las ocupaciones del cliente' });
  }
};


