import express from 'express';
import { connectDB } from './config/database';
import { route } from './routes/routes';
import { config } from './utils/config';
import { errorHandler, noFoundHandler } from './utils/bodyResponseApi';

const app = express();

const PORT = config.PORT!;

// Middlewares
app.use(express.json()); // Para JSON

// Ruta por defecto
app.get('/', (req: any, res: any) => {
  res.send('🚀 Microservicio auth está ON');
});

// rutas de atenticacion
app.use('/api/auth', route);

// Ruta no encontrada (404)
app.use(noFoundHandler);

// Middleware de errores
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Servidor AUTH corriendo en http://localhost:${PORT}`);
  });
};

startServer();
