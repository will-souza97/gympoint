import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ Error: "This Student doesn't exists" });
    }

    const checkins = await Checkin.findAll({
      where: { student_id },
      order: [['id', 'desc']],
      attributes: ['id', 'student_id', 'created_at'],
    });

    return res.status(200).json(checkins);
  }

  async store(req, res) {
    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ Error: "This Student doesn't exists" });
    }

    const verifyCheckins = await Checkin.findAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [subDays(new Date(), 7), new Date()],
        },
      },
    });

    if (verifyCheckins && verifyCheckins.length >= 5) {
      return res
        .status(400)
        .json({ Error: 'You can only do 5 check-ins in a 7 day period' });
    }

    const newCheckin = await Checkin.create({ student_id });

    return res.status(201).json(newCheckin);
  }
}

export default new CheckinController();
