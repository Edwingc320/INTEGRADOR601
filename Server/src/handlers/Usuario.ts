
import  Usuario  from '../models/Usuario.model';
import Cliente from '../models/Cliente.model'
import { Op } from 'sequelize' 
import { Request, Response } from "express";
export const getUsuarios = async (_req: Request, res: Response) => {
  const usuarios = await Usuario.findAll();
  res.json({ data: usuarios });
};

export const getUsuarioById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ data: usuario });
};
export const getUsuariosPorNombre = async (req: Request, res: Response) => {
  const { nombre } = req.query

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({ error: 'Parámetro "nombre" requerido y debe ser una cadena' })
  }

  const usuarios = await Usuario.findAll({
    where: {
      nombre: {
        [Op.like]: `%${nombre}%`
      }
    }
  })

  res.json({ data: usuarios })
}

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.create(req.body)
    res.status(201).json({ data: usuario })  // 👈 Asegúrate que esté así
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' })
  }
}


export const updateUsuario = async (req: Request, res: Response) => {
  const { id_usuario } = req.params;
  const usuario = await Usuario.findByPk(id_usuario);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  await usuario.update(req.body);
  res.json({ data: usuario });
};

export const deleteUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  await usuario.destroy();
  res.json({ message: 'Usuario eliminado' });
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
    res.status(500).json({ message: 'Error al buscar cliente', error })
  }
}

export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, contrasena } = req.body;

    if (!nombre || !contrasena) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const usuarioEncontrado = await Usuario.findOne({
      where: { nombre, contrasena }
    });

    if (!usuarioEncontrado) {
      return res.status(401).json({ message: "Acceso denegado" });
    }

    res.status(200).json({
      message: "Acceso concedido",
      data: usuarioEncontrado
    });

  } catch (error) {
    console.error("Error en loginUsuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};