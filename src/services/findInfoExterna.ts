import axios from 'axios';
import { config } from '../utils/config';

// Función para obtener los datos del rol y usuario
export const getRoleAndUserData = async ({ userId }: { userId: number }) => {
  try {
    const api = `${config.API_FIND_USER_BY_ID}/${userId}`;

    const response = await axios.get(api);
    const { data } = response.data;

    // Validaciones del rol, usuario y empresa
    if (!data.activeRole) {
      return {
        status: false,
        message: 'El usuario o el rol no están activos',
        data: null,
      };
    }

    if (!data.isActive) {
      return {
        status: false,
        message: 'El usuario o el rol no están activos',
        data: null,
      };
    }

    if (!data.activeCompany) {
      return {
        status: false,
        message: 'La empresa asociada al rol o usuario no está activa',
        data: null,
      };
    }

    return { status: true, message: 'Datos obtenidos correctamente', data };
  } catch (error: any) {
    return {
      status: false,
      message: error.response?.data?.message || 'Error al obtener los datos del usuario',
      data: null,
    };
  }
};
