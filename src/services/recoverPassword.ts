import { Token } from '../models/token';
import axios from 'axios';
import { config } from '../utils/config';
import { UserResp } from '../interface/interface';
import * as jwt from 'jsonwebtoken';
import { Optional } from 'sequelize';
// Función para generar el token JWT
const generateToken = ({
  id,
  firstName,
  lastName,
  email,
  roleId,
  reputation,
  roleName,
  typeDocumentId,
  typeDocumentName,
  documentNumber,
  phoneNumber,
  isGoogle,
  isActive,
  companyId,
  companyName,
  activeCompany,
}: UserResp): string => {
  const payload = {
    email,
    id,
  };

  return jwt.sign(payload, config.JWT_SECRET_KEY!, {
    expiresIn: '1d', //TODO: no esta reconociendo los env, no permitio de ninguna manera trabajarlo con el .env
  });
};
const validations = (data: UserResp) => {
  // Paso 1: Verificar si el usuario existe
  if (!data || !data.password) return { message: 'Usuario no encontrado', status: false };

  //Paso 2: Validaciones del rol, usuario y empresa
  if (!data.activeRole) return { message: 'El usuario o el rol no están activos', status: false };

  if (!data.isActive) return { message: 'El usuario no está activo', status: false };

  if (!data.activeCompany)
    return {
      message: 'La empresa asociada al rol o usuario no está activa',
      status: false,
    };
};
export const recoverPasswordService = async ({
  email,
}: {
  email: string;
}): Promise<{ message: string; status: boolean; linkRecoverPassword?: string }> => {
  try {
    // Paso 1: Consultar el usuario en la base de datos o API externa
    const api = `${config.API_FIND_USER_BY_EMAIL}/${email}`;

    const response = await axios.get(api);

    const { data } = response.data;

    // Paso 2: validar el usuario
    const resultValidation = validations(data);

    if (resultValidation) return resultValidation;

    // Paso 3: Generar el token si la autenticación es exitosa
    const token = generateToken({ ...data });
    const tokenData = {
      token: token.toString(),
      userId: parseInt(data.id), // Asegúrate de que `data.id` sea un número
    };

    //Paso 4: Crear el token usando Sequelize, excluyendo las propiedades innecesarias
    await Token.create(tokenData as Optional<Token, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>);

    //Paso 5: generar el link de recuperado de contraseña TODO: falta acomodar la url del front
    const linkRecoverPassword = `url?token=${token}`;

    // Si todo está bien, retornar éxito y el link de recuperado
    return { message: 'Link de recupera de contraseña', status: true, linkRecoverPassword };
  } catch (error: any) {
    return { message: error.response.data.message, status: false };
  }
};

export const updatePasswordService = async ({
  email,
  password,
  repeatPassword,
}: {
  email: string;
  password: string;
  repeatPassword: string;
}): Promise<{ message: string; status: boolean; linkRecoverPassword?: string }> => {
  try {
    // Paso 1: Consultar el usuario en la base de datos o API externa
    const api = `${config.API_UPDATE_PASSWORD}`;

    // Suponiendo que estás enviando un cuerpo con datos, como el correo
    const body = {
      email,
      password,
      repeatPassword,
    };
    

    const response = await axios.put(api, body);

    const { status, message } = response.data;

    return { message: message, status };
  } catch (error: any) {
    return { message: error.response.data.message, status: false };
  }
};
