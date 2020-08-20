import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.STRING,
        peso: Sequelize.STRING,
        altura: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default Student;
