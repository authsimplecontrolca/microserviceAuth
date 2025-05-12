import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { Token } from '../models/token';
import { Optional } from 'sequelize';
import { config } from '../utils/config';
import { UserResp } from '../interface/interface';

// Función para generar el token JWT
const generateToken = async ({
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
}: UserResp): Promise<string> => {
  const apiCompany = `${config.API_FIND_COMPANY_BY_ID}/${companyId}`;
  console.log({apiCompany});
  
  const responseCompany = await axios.get(apiCompany);
  console.log({responseCompany},148,"token");
  
  const dataCompany = responseCompany.data.data; // Usamos `data` para acceder a la respuesta correcta

  const payload = {
    user: {
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
    },
    company: {
      id: companyId,
      commercialName: dataCompany.commercialName,
      fiscalName: dataCompany.fiscalName,
      representativeFirstName: dataCompany.representativeFirstName,
      representativeLastName: dataCompany.representativeLastName,
      ruc: dataCompany.ruc,
      contactNumber: dataCompany.contactNumber,
      corporateEmail: dataCompany.corporateEmail,
      address: dataCompany.address,
      isActive: dataCompany.isActive === 1, // Se asume que 1 es activo
      activeWorkers: dataCompany.activeWorkers,
      website: dataCompany.website,
      description: dataCompany.description,
      logoImageId: dataCompany.logoImageId,
      backgroundImageId: dataCompany.backgroundImageId,
      mapUrl: dataCompany.mapUrl,
      paymentMethodId: dataCompany.paymentMethodId,
      categoryId: dataCompany.categoryId,
      companySizeId: dataCompany.companySizeId,
      countryId: dataCompany.countryId,
      categoryName: dataCompany.categoryName,
      sizeRange: dataCompany.sizeRange,
      countryName: dataCompany.countryName,
    },
  };

  return jwt.sign(payload, config.JWT_SECRET_KEY!, {
    expiresIn: '7d', // Establecer el tiempo de expiración del token
  });
};

const validations = (data: UserResp) => {
  // Paso 1: Verificar si el usuario existe
  if (!data || !data.password) return { message: 'Usuario no encontrado', status: false };

  // Paso 2: Validaciones del rol, usuario y empresa
  if (!data.activeRole) return { message: 'El usuario o el rol no están activos', status: false };

  if (!data.isActive) return { message: 'El usuario no está activo', status: false };

  if (!data.activeCompany)
    return {
      message: 'La empresa asociada al rol o usuario no está activa',
      status: false,
    };
};

// Servicio de login
export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ message: string; status: boolean; token?: string }> => {
  try {
    // Paso 1: Consultar el usuario en la base de datos o API externa
    const api = `${config.API_FIND_USER_BY_EMAIL}/${email}`;

    const response = await axios.get(api);
console.log(228);

    const { data } = response.data;
    console.log(231);

    const resultValidation = validations(data);
    console.log(232);

    if (resultValidation) return resultValidation;
    console.log(237);

    // Paso 3: Comparar la contraseña proporcionada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, data.password);
    console.log(240);

    if (!isPasswordValid)
      return { message: 'Contraseña incorrecta. Verifica los datos e intenta nuevamente.', status: false };
    console.log(245);

    // Paso 4: Generar el token si la autenticación es exitosa
    const token = await generateToken({ ...data });
    console.log({token}, 249);
    
    const tokenData = {
      token: token.toString(),
      userId: parseInt(data.id), // Asegúrate de que `data.id` sea un número
    };
    console.log(253);

    // Crear el token usando Sequelize, excluyendo las propiedades innecesarias
    await Token.create(tokenData as Optional<Token, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>);
    console.log(257);

    // Si todo está bien, retornar éxito y el token
    return { message: 'Inicio de sesión exitoso', status: true, token };
  } catch (error: any) {
    return { message: error.response.data.message, status: false };
  }
};
