import dotenv from 'dotenv';
dotenv.config(); // Cargar variables desde el `.env`

// Definimos el tipado para la configuración
interface Config {
  SECRET_KEY: string;
  JWT_SECRET_KEY: string;
  API_FIND_USER_BY_EMAIL: string;
  API_FIND_USER_BY_ID: string;
  API_FIND_COMPANY_BY_ID: string;
  EXPIRESIN: string;
  PORT: number;
  API_UPDATE_PASSWORD: string;
}

const ENV = process.env.DEPLOYIN || 'DEV'; // Si no se define, usa "DEV"

const devConfig: Config = {
  SECRET_KEY: process.env.SECRET_KEY_DEV!,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY_DEV!,
  API_FIND_USER_BY_EMAIL: process.env.API_FIND_USER_BY_EMAIL_DEV!,
  API_FIND_USER_BY_ID: process.env.API_FIND_USER_BY_ID_DEV!,
  API_FIND_COMPANY_BY_ID:process.env.API_FIND_COMPANY_BY_ID_DEV!,
  EXPIRESIN: process.env.EXPIRES_IN_DEV!,
  PORT: parseInt(process.env.PORT_DEV!),
  API_UPDATE_PASSWORD: process.env.API_UPDATE_PASSWORD_DEV!,
};

const prodConfig: Config = {
  SECRET_KEY: process.env.SECRET_KEY_PROD!,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY_PROD!,
  API_FIND_USER_BY_EMAIL: process.env.API_FIND_USER_BY_EMAIL_PROD!,
  API_FIND_USER_BY_ID: process.env.API_FIND_USER_BY_ID_PROD!,
  API_FIND_COMPANY_BY_ID:process.env.API_FIND_COMPANY_BY_ID_PROD!,

  EXPIRESIN: process.env.EXPIRES_IN_PROD!,
  PORT: parseInt(process.env.PORT_PROD!),
  API_UPDATE_PASSWORD: process.env.API_UPDATE_PASSWORD_PROD!,
};

// Seleccionar configuración según el entorno
export const config: Config = ENV === 'PROD' ? prodConfig : devConfig;

console.log(`🔧 Configuración cargada para: ${ENV}`);
