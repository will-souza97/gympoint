import * as Yup from 'yup';
import HelpOrder from '../models/Help_order';

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

    const { answer } = req.body;

    const date = new Date();
    helpOrder.answer = answer;
    helpOrder.answer_at = date;
    await helpOrder.save();

    return res.json(helpOrder);
  }
}

export default new AnswersController();
