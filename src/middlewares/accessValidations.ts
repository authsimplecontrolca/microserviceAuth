import { NextFunction, Request, Response } from 'express';
import { TokenService } from '../services/validationsToken';
import { validateRoute } from '../services/validationsRoute';
import { getRoleAndUserData } from '../services/findInfoExterna';
import { errorResponse } from '../utils/bodyResponseApi';

// Función para verificar si el usuario tiene acceso a la ruta solicitada
export const checkAccessToRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Paso 1: Obtener el token y la ruta solicitada de la solicitud
    const token = req.headers['authorization']?.split(' ')[1]; // El token se espera en el formato "Bearer <token>"

    const requestedRoute = req.body.url; // La ruta solicitada

    if (!token) {
      res.status(400).json(errorResponse({ message: 'Token no proporcionado' }));
      return;
    }

    // Paso 2: Validar el token (TokenService debe implementar la verificación)
    const { decodedToken, messageToken, statusToken } = await TokenService.verifyToken(token);

    // Paso 3: Verificar si la verificación del token falló (status: false)
    if (!statusToken) {
      // Si la validación del token falla, respondemos con un error
      res.status(401).json(errorResponse({ message: messageToken }));
      return;
    }

    // Paso 3: Obtener los datos del rol y usuario
    const { status, message, data } = await getRoleAndUserData({
      userId: decodedToken!.user.id,
    });
    if (!status) {
      res.status(400).json(errorResponse({ message: message }));
      return;
    }

    // Paso 4: Validar la ruta solicitada
    const respRoute = await validateRoute({
      requestedRoute,
      roleId: parseInt(data.roleId),
    });
    if (!respRoute.status) {
      res.status(400).json(errorResponse({ message: respRoute.message }));
      return;
    }

    next();
  } catch (error: any) {
    throw new Error(error.message || 'No autorizado');
  }
};
