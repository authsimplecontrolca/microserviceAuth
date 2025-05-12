import { Token } from '../models/token';
// Función de logout
export const logoutService = async ({
  userId,
  token,
}: {
  userId: number;
  token: string;
}): Promise<{ message: string; status: boolean }> => {
  try {
    // Paso 1: Actualizar el campo isActive a false en el token
    const result = await Token.update(
      { isActive: false },
      {
        where: {
          userId,
          token,
        },
      }
    );

    // Si no se actualizó ningún token, se devuelve un error
    if (result[0] === 0) {
      return {
        message: 'No se encontró el token para desactivarlo',
        status: false,
      };
    }

    // Paso 2: Retornar mensaje de éxito
    return { message: 'Sesión cerrada exitosamente', status: true };
  } catch (error: any) {
    return { message: 'Ocurrió un error al cerrar sesión', status: false };
  }
};
