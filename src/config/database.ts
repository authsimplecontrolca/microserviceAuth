import { Sequelize } from 'sequelize-typescript';
import { registerModels } from '.';
// TODO: actualizar todos los modelos para que tomen la fecha de peru
export const DataBase = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin',
  database: 'pruebas',
  models: [], // Este se mantiene vacío, ya que los modelos se registran dinámicamente
  logging: false,
});

// Llamamos a la función que registra los modelos
registerModels(DataBase);

// Sincronizamos la base de datos (esto crea las tablas)
const syncDatabase = async () => {
  try {
    await DataBase.sync({ alter: false }); // `force: false` no borra las tablas existentes, cambia a `true` si deseas que se borren.
    console.log('✅ Tablas sincronizadas con éxito');
  } catch (error) {
    console.error('❌ Error al sincronizar las tablas:', error);
  }
};

// Llamamos a la función para sincronizar
syncDatabase();

// Función de conexión
export const connectDB = async () => {
  try {
    await DataBase.authenticate();
    console.log('✅ Conexión a MySQL exitosa');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
};
