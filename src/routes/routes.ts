import { Router } from 'express';
import {
  loginController,
  logoutController,
  recoverPasswordController,
  updatePasswordController,
  validationController,
} from '../controllers/controllers';
import { loginValidation } from '../middlewares/validations';
import { verifyTokenRecover, verifyTokenSave } from '../utils/saveTokenInformation';
import { checkAccessToRoute } from '../middlewares/accessValidations';

export const route: Router = Router();

route.post('/login', loginValidation, loginController);

route.post('/logout', verifyTokenSave, logoutController);

// solicitad cambiar la contraseña TODO: el envio de correo
route.get('/recover/password', verifyTokenRecover, recoverPasswordController);

route.put('/update/password', verifyTokenRecover, updatePasswordController);

// Endpoint para validar token y acceso a la ruta
route.post('/validate', checkAccessToRoute, validationController);
