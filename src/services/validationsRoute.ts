import { Route } from '../models/route';

// Función para comparar rutas por segmentos
const isMatchingRoute = (routePattern?: string, requestedRoute?: string): boolean => {
  if (!routePattern || !requestedRoute) {
    return false;
  }

  const patternSegments = routePattern.split('/');
  const requestSegments = requestedRoute.split('/');

  if (patternSegments.length !== requestSegments.length) return false;

  return patternSegments.every((segment, index) => segment.startsWith(':') || segment === requestSegments[index]);
};

// Función para validar si la ruta existe y está activa
export const validateRoute = async ({
  requestedRoute,
  roleId,
}: {
  requestedRoute: string;
  roleId: number;
}): Promise<{ status: boolean; message: string }> => {
  try {
    if (!requestedRoute) {
      return { status: false, message: 'La ruta solicitada es inválida' };
    }

    // Obtener todas las rutas de la BD
    const routes = await Route.findAll({ raw: true });

    if (!routes.length) {
      return { status: false, message: 'No hay rutas registradas en la BD' };
    }

    // Filtrar solo rutas que tengan un routePattern válido
    const validRoutes = routes.filter((route) => typeof route.routePattern === 'string');

    // Buscar la ruta correcta
    const matchingRoute = validRoutes.find((route) => isMatchingRoute(route.routePattern, requestedRoute));

    if (!matchingRoute) {
      return { status: false, message: `Ruta ${requestedRoute} no encontrada` };
    }

    if (!matchingRoute.isActive) {
      return { status: false, message: `La ruta ${requestedRoute} no está activa` };
    }

    // Convertir roleIds a un array si es un string
    let roleIds = matchingRoute.roleIds;
    if (typeof roleIds === 'string') {
      try {
        roleIds = JSON.parse(roleIds);
        if (!Array.isArray(roleIds)) throw new Error('roleIds debe ser un array');
      } catch (e) {
        return { status: false, message: 'Formato de roles inválido' };
      }
    }

    if (!roleIds.includes(roleId)) {
      return { status: false, message: 'El rol no tiene acceso a esta ruta' };
    }

    return { status: true, message: 'Ruta válida y accesible' };
  } catch (error: any) {
    return {
      status: false,
      message: error.message || 'Error al validar la ruta',
    };
  }
};
