const jwt = require('jsonwebtoken');

// Función para generar un token
function generarToken(claveSecreta, userId, email) {
    // Datos del cuerpo del token
    const payload = {
        userId: userId,
        email: email,
        password: 'Jharol.2000',
        repeatPassword: 'Jharol.2000'
    };

    // Opciones del token (expiración de 1 día)
    const opciones = {
        expiresIn: '1d' // Token expirará en 1 día
    };

    // Generar el token
    const token = jwt.sign(payload, claveSecreta, opciones);
    return token;
}

// Función para verificar el token
const verificarToken = (token, claveSecreta) => {
    try {
        // Verificar el token
        const decoded = jwt.verify(token, claveSecreta);
        console.log('Token válido:', decoded); // Si el token es válido
    } catch (error) {
        // Manejo de errores
        if (error.name === 'TokenExpiredError') {
            console.log('El token ha expirado');
        } else {
            console.log('Error al verificar el token:', error.message);
        }
    }
};

// Clave secreta proporcionada
const claveSecreta = '6c8ee2f1235c5bfa3c6a4dfbd1341f94f855e79a3720d2e6bf2d542de350f88d';
const userId = 6;
const email = '1@1.com';


// Paso 1: Generar el token
const token = generarToken(claveSecreta, userId, email);
console.log('Token generado:', token);

// Paso 2: Verificar el token
verificarToken(token, claveSecreta);
