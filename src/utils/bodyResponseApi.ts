// utils/response.ts

import { NextFunction, Request, Response } from 'express';

interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
  error?: any;
}

export const successResponse = ({ message, data }: { message: string; data?: any }): ApiResponse => {
  return {
    status: true,
    message,
    data: data || null,
  };
};

export const errorResponse = ({ message, error }: { message: string; error?: any }): ApiResponse => {
  return {
    status: false,
    message,
    error: error || null,
  };
};

// Middleware global de errores
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json(errorResponse({ message: err.message, error: err.stack }));
};

export const noFoundHandler = (req: Request, res: Response) => {
  res.status(404).json(successResponse({ message: `Ruta ${req.originalUrl} no encontrada` }));
};
