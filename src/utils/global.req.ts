// express.d.ts
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  reputation: number;
  roleName: string;
  typeDocumentId: number;
  documentNumber: string;
  phoneNumber: string;
  typeDocumentName: string; // Asegúrate de incluir 'typeDocumentName'

  isGoogle: boolean; // Suponiendo que es un número (0 o 1)
  isActive: boolean; // Suponiendo que es un número (0 o 1)
  companyId: number;
}

export interface Company {
  id: number;
  name: string;
  isActive: boolean; // Suponiendo que es un número (0 o 1)
}

export interface TokenPayload {
  user: User;
  company: Company;
  token: string;
}
export interface TokenPayloadRecover {
  email: string;
  password: string;
  repeatPassword?: string;
}
declare global {
  namespace Express {
    interface Request {
      payloadToken?: TokenPayload; // Agregamos la propiedad `user` al tipo `Request`
      TokenPayloadRecover: TokenPayloadRecover;
    }
  }
}
