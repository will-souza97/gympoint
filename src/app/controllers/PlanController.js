import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation failed' });
    }

    const planExists = await Plans.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ Error: 'Plan already exists' });
    }

    const { title, duration, price } = await Plans.create(req.body);

    return res.json({ title, duration, price });
  }
}

export default new PlanController();
