import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayloadRecover } from './global.req';
import { config } from './config';
import { errorResponse } from './bodyResponseApi';
import { TokenService } from '../services/validationsToken';

// Middleware para verificar el token y agregar los datos al req
export const verifyTokenSave = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Obtener el token de las cabeceras (generalmente en Authorization: Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) {
    res.status(401).json(errorResponse({ message: 'Debe Ingresar un token.' }));
    return;
  }

  // Verificar y decodificar el token
  const { messageToken, statusToken, decodedToken } = await TokenService.verifyToken(token);

  if (!statusToken) {
    res.status(400).json(errorResponse({ message: messageToken }));
    return;
  }

  // Agregar los datos del token al req
  req.payloadToken = {
    user: {
      id: decodedToken!.user.id,
      firstName: decodedToken!.user.firstName,
      lastName: decodedToken!.user.lastName,
      email: decodedToken!.user.email,
      roleId: decodedToken!.user.roleId,
      reputation: decodedToken!.user.reputation,
      roleName: decodedToken!.user.roleName,
      typeDocumentId: decodedToken!.user.typeDocumentId,
      documentNumber: decodedToken!.user.documentNumber,
      phoneNumber: decodedToken!.user.phoneNumber,
      typeDocumentName: decodedToken!.user.typeDocumentName, // Asegúrate de incluir 'typeDocumentName'
      isGoogle: decodedToken!.user.isGoogle,
      isActive: decodedToken!.user.isActive,
      companyId: decodedToken!.user.companyId,
    },
    company: {
      id: decodedToken!.user.companyId,
      name: decodedToken!.company.name,
      isActive: decodedToken!.company.isActive,
    },
    token: token!,
  };

  next(); // Continuar con la siguiente función/middleware
};

export const verifyTokenRecover = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Obtener el token de las cabeceras (generalmente en Authorization: Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    // Si no hay token, devolver error 401
    if (!token) {
      res.status(401).json(errorResponse({ message: 'Debe ingresar un token.' }));
      return;
    }

    // Verificar y decodificar el token

    // Verificar el token usando JWT_SECRET_KEY
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY) as TokenPayloadRecover;

    // Agregar los datos del token al req
    req.TokenPayloadRecover = {
      email: decoded.email,
      password: decoded.password,
      repeatPassword: decoded.repeatPassword,
    };

    // Continuar con la siguiente función/middleware
    next();
  } catch (error: any) {
    // Si el token es inválido o ha expirado
    if (error.name === 'TokenExpiredError') {
      res.status(400).json(errorResponse({ message: 'Token expirado' }));
      return;
    }
    res.status(400).json(errorResponse({ message: error.message || 'Token inválido.' }));
  }
};
