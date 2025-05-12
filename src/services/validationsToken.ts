// services/tokenService.ts
import jwt from 'jsonwebtoken';
import { config } from '../utils/config';
import { Token } from '../models/token';

// Definimos el tipo DecodedToken
export interface DecodedToken {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    documentNumber: string;
    typeDocumentId: number;
    phoneNumber: string;
    email: string;
    companyId: number;
    isGoogle: boolean;
    isActive: boolean;
    reputation: number;
    roleId: number;
    createdBy: number;
    typeDocumentName: string;
    roleName: string;
  };
  company: {
    id: string;
    isActive: boolean;
    name: string;
  };
  exp: number;
}

export interface TokenResponse {
  statusToken: boolean;
  messageToken: string;
  decodedToken?: DecodedToken;
}

const JWT_SECRET_KEY = `${config.JWT_SECRET_KEY!}`;

export class TokenService {
  static async verifyToken(token: string): Promise<TokenResponse> {
    try {
      const is_exist = await Token.findOne({ where: { token, isActive: true } });
      if (!is_exist) {
        return { statusToken: false, messageToken: 'El token ya no es valido' };
      }
      const decoded = jwt.verify(token, JWT_SECRET_KEY) as DecodedToken;

      if (!decoded.user.isActive) {
        return { statusToken: false, messageToken: 'El usuario no está activo' };
      }

      if (!decoded.company.isActive) {
        return { statusToken: false, messageToken: 'La empresa no está activa' };
      }

      return { statusToken: true, messageToken: 'Token válido', decodedToken: decoded };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return { statusToken: false, messageToken: 'Token expirado' }; // Personaliza el mensaje aquí
      }
      return { statusToken: false, messageToken: error.message || 'Token inválido o expirado' };
    }
  }
}
