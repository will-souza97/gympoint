import Sequelize from 'sequelize';

import Admin from '../app/models/Admin';
import databaseConfig from '../config/database';
import Student from '../app/models/Student';
import Plans from '../app/models/Plans';

const models = [Admin, Student, Plans];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
