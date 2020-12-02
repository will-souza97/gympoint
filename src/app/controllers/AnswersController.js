import * as Yup from 'yup';
import HelpOrder from '../models/Help_order';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class AnswersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'An answer is required' });
    }

    const { id } = req.params;

    const helpOrder = await HelpOrder.findOne({
      where: { id },
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    const student = await Student.findOne({
      where: { id: helpOrder.student_id },
    });

    if (!student) {
      return res.status(400).json({ Error: "This Student doesn't exists" });
    }

    const { answer } = req.body;

    const date = new Date();

    await helpOrder.update({
      answer,
      answer_at: date,
    });
    await helpOrder.save();

    await Queue.add(AnswerMail.key, {
      helpOrder,
      student,
    });

    return res.json(helpOrder);
  }
}

export default new AnswersController();
