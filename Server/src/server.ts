// src/index.ts o donde inicialices el servidor
import express from 'express';
import router from './router';
import cors from 'cors';
import db from './config/db';

async function connectDB() {
  try {
    await db.authenticate();
    await db.sync();  // Asegúrate de usar await para esperar a que termine
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectarse con la base de datos:', error);
  }
}

connectDB();


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router); // montar todas tus rutas

export default app;
