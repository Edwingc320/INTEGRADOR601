import { Router } from 'express';
import db from './config/db';
import * as Usuario from './handlers/Usuario';
// or, if Usuario exports individual functions, use:
// import { getUsuarioById, getUsuarios, createUsuario, updateUsuario, deleteUsuario } from './handlers/Usuario';
import * as Cliente from './handlers/Cliente';
import * as Carro from './handlers/Carro';
import { asyncHandler } from './handlers/asyncHandler';
import * as Cajones from './handlers/Cajones';
import * as Pago from './handlers/Pago';
import * as Ocupacion from './handlers/Ocupacion';

const router = Router();

router.get('/usuarios/:id', (req, res, next) => {
  Promise.resolve(Usuario.getUsuarioById(req, res)).catch(next);
});
router.get('/usuarios', Usuario.getUsuarios);
router.get('/usuarios/:id', (req, res, next) => {
    Promise.resolve(Usuario.getUsuarioById(req, res)).catch(next);
});
router.get('/usuarios/buscar/nombre', (req, res, next) => {
  Promise.resolve(Usuario.getUsuariosPorNombre(req, res)).catch(next);
});



router.post('/usuarios', Usuario.createUsuario);
router.put('/usuarios/:id_usuario', (req, res, next) => {
    Promise.resolve(Usuario.updateUsuario(req, res)).catch(next);
});
router.delete('/usuarios/:id', (req, res, next) => {
    Promise.resolve(Usuario.deleteUsuario(req, res)).catch(next);
});
router.post('/usuarios/login', (req, res, next) => {
  Promise.resolve(Usuario.loginUsuario(req, res)).catch(next);
});


// Clientes
router.get('/clientes', Cliente.getClientes);
router.get('/clientes/:id', (req, res, next) => {
    Promise.resolve(Cliente.getClienteById(req, res)).catch(next);
});

router.get('/clientes/por-usuario/:id_usuario', (req, res, next) => {
  Promise.resolve(Cliente.getClientePorUsuario(req, res)).catch(next)
})
router.post('/clientes', Cliente.createCliente);
router.put('/clientes/:id', (req, res, next) => {
    Promise.resolve(Cliente.updateCliente(req, res)).catch(next);
});
router.delete('/clientes/:id', (req, res, next) => {
    Promise.resolve(Cliente.deleteCliente(req, res)).catch(next);
});

// Carros
router.get('/carros', Carro.getCarros);
router.get('/carros/:id', (req, res, next) => {
    Promise.resolve(Carro.getCarroById(req, res)).catch(next);
});
router.post('/carros', Carro.createCarro);
router.put('/carros/:id', (req, res, next) => {
    Promise.resolve(Carro.updateCarro(req, res)).catch(next);
});
router.delete('/carros/:id', (req, res, next) => {
    Promise.resolve(Carro.deleteCarro(req, res)).catch(next);
});

// Cajones
router.get('/cajones', Cajones.getCajones);
router.get('/cajones/disponibles', (req, res, next) => {
  Promise.resolve(Cajones.getCajonesDisponibles(req, res)).catch(next);
});

router.get('/cajones/:id', (req, res, next) => {
    Promise.resolve(Cajones.getCajonById(req, res)).catch(next);
});

router.post('/cajones', Cajones.createCajon);
router.put('/cajones/:id', (req, res, next) => {
    Promise.resolve(Cajones.updateCajon(req, res)).catch(next);
});
router.delete('/cajones/:id', (req, res, next) => {
    Promise.resolve(Cajones.deleteCajon(req, res)).catch(next);
});


// Pagos
router.get('/pagos', Pago.getPagos);
router.get('/pagos/:id', (req, res, next) => {
    Promise.resolve(Pago.getPagoById(req, res)).catch(next);
});
router.post('/pagos', Pago.createPago);
router.put('/pagos/:id', (req, res, next) => {
    Promise.resolve(Pago.updatePago(req, res)).catch(next);
});
router.delete('/pagos/:id', (req, res, next) => {
    Promise.resolve(Pago.deletePago(req, res)).catch(next);
});

// Ocupaciones
// Ocupaciones
router.get('/ocupaciones/cliente/:id_cliente',  asyncHandler(Ocupacion.getOcupacionesByCliente));



router.get('/ocupaciones', Ocupacion.getOcupaciones);
router.get('/ocupaciones/:id', (req, res, next) => {
    Promise.resolve(Ocupacion.getOcupacionById(req, res)).catch(next);
});
router.post('/ocupaciones', Ocupacion.createOcupacion);
router.put('/ocupaciones/:id', (req, res, next) => {
    Promise.resolve(Ocupacion.updateOcupacion(req, res)).catch(next);
});
router.delete('/ocupaciones/:id', (req, res, next) => {
    Promise.resolve(Ocupacion.deleteOcupacion(req, res)).catch(next);
});



import { QueryTypes } from 'sequelize';

// ...

router.get('/cliente/:id/reservas-pendientes', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT o.*, c.numero AS numero_cajon
      FROM ocupacion o
      JOIN cajon c ON o.id_cajon = c.id_cajon
      WHERE o.id_cliente = ? AND o.estado = 'reservado' AND o.id_pago IS NULL
      `,
      {
        replacements: [id],
        type: QueryTypes.SELECT
      }
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reservas pendientes.' });
  }
});




export default router;
