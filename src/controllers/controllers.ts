import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { TokenPayload, TokenPayloadRecover } from '../utils/global.req';
import { loginService } from '../services/login';
import { logoutService } from '../services/logout';
import { errorResponse, successResponse } from '../utils/bodyResponseApi';
import { recoverPasswordService, updatePasswordService } from '../services/recoverPassword';

// Controlador de Login
export const loginController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const resp = await loginService({ email, password });
console.log("llegue",resp);

  if (!resp.status) {
    res.status(400).json(errorResponse({ message: resp.message }));
    return;
  }

  res.status(200).json(successResponse({ message: resp.message, data: resp.token }));
});

// Controlador de Logout
export const logoutController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { user, token } = req.payloadToken as TokenPayload;
  const resp = await logoutService({ userId: user.id, token });

  if (!resp.status) {
    res.status(400).json(errorResponse({ message: resp.message }));
    return;
  }

  res.status(200).json(successResponse({ message: resp.message }));
});

// Controlador de la validacion de seguridad
export const validationController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json(successResponse({ message: 'Permisos concedidos con éxito.' }));
});

export const recoverPasswordController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.TokenPayloadRecover as TokenPayloadRecover;

  const resp = await recoverPasswordService({ email });

  if (!resp.status) {
    res.status(400).json(errorResponse({ message: resp.message }));
    return;
  }

  res.status(200).json(successResponse({ message: resp.message, data: resp }));
});

export const updatePasswordController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password, repeatPassword } = req.TokenPayloadRecover as TokenPayloadRecover;

  const resp = await updatePasswordService({ email, password: password!, repeatPassword: repeatPassword! });

  if (!resp.status) {
    res.status(400).json(errorResponse({ message: resp.message }));
    return;
  }

  res.status(200).json(successResponse({ message: resp.message }));
});
