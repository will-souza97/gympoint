import * as Yup from 'yup';
import HelpOrder from '../models/Help_order';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ Error: "This Student doesn't exists" });
    }

    const { page = 1 } = req.query;
    const listOrders = await HelpOrder.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!listOrders) {
      return res.status(400).json({ Error: "There isn't existing list" });
    }

    return res.status(200).json(listOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'A message is required' });
    }

    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const { question } = req.body;

    const createorder = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json(createorder);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation failed' });
    }

    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ Error: "This Student doesn't exists" });
    }

    const helpOrder = await HelpOrder.findOne({ where: { student_id } });

    if (!helpOrder) {
      return res.status(400).json({ Error: "This Help Order doesn't exists" });
    }

    const { question } = req.body;

    if (!(question !== helpOrder.question)) {
      return res
        .status(400)
        .json({ error: ' This question has already been asked ' });
    }

    const updatedQuestion = await helpOrder.update({
      question,
    });

    return res.json(updatedQuestion);
  }
}

export default new HelpOrderController();
