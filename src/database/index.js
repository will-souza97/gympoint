import Sequelize from 'sequelize';

import Admin from '../app/models/Admin';
import Student from '../app/models/Student';

import databaseConfig from '../config/database';

const modelsAdmin = [Admin];
const modelsStudent = [Student];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    modelsAdmin.map((model) => model.init(this.connection));
    modelsStudent.map((model) => model.init(this.connection));
  }
}

export default new Database();
