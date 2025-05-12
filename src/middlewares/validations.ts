import { allValidator } from "../utils/expressValidator";
import { body } from "express-validator";

// Definición de las validaciones para el login
export const loginValidation = [
  // Validar que el email esté presente y sea un email válido
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe ser un email válido"),
    

  // Validar que la contraseña esté presente y tenga una longitud mínima
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  allValidator,
];
