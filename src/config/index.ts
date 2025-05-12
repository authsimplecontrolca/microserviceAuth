import { Sequelize } from 'sequelize-typescript';
import { activeModels } from './activeModel';
import { Token } from '../models/token';
import { Route } from '../models/route';

const models: any[] = [];

// Solo agrega los modelos que están activos en activeModels
if (activeModels.Token === 'on') models.push(Token);
if (activeModels.Route === 'on') models.push(Route);

export const registerModels = (sequelize: Sequelize) => {
  console.log('📦 Modelos activos:', models.map(m => m.name)); // Imprime los modelos que se están registrando
  sequelize.addModels(models);
};
