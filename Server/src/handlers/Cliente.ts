import { Request, Response } from "express";
import Cliente from '../models/Cliente.model';

export const getClientes = async (_req: Request, res: Response) => {
  const clientes = await Cliente.findAll();
  res.json({ data: clientes });
};

export const getClienteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cliente = await Cliente.findByPk(id);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json({ data: cliente });
};

export const getClientePorUsuario = async (req: Request, res: Response) => {
  const { id_usuario } = req.params

  try {
    const cliente = await Cliente.findOne({
      where: { id_usuario }
    })

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado para este usuario' })
    }

    res.status(200).json({ data: cliente })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar cliente', error })
  }
}

export const createCliente = async (req: Request, res: Response) => {
  const cliente = await Cliente.create(req.body);
  res.status(201).json({ data: cliente });
};

export const updateCliente = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cliente = await Cliente.findByPk(id);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  await cliente.update(req.body);
  res.json({ data: cliente });
};

export const deleteCliente = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cliente = await Cliente.findByPk(id);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  await cliente.destroy();
  res.json({ message: 'Cliente eliminado' });
};