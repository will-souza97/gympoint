import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const listPlans = await Plans.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(listPlans);
  }

  async show(req, res) {
    const plan = await Plans.findOne({
      where: { id: req.params.id },
    });

    if (!plan) {
      return res.status(400).json({ Error: "This Plan doesn't exists!" });
    }

    return res.json(plan);
  }

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
      return res.status(400).json({ Error: 'This Plan already exists' });
    }

    const { id, title, duration, price } = await Plans.create(req.body);

    return res.status(201).json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation failed' });
    }

    const plan = await Plans.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ Error: "Plan doesn't exists!" });
    }

    await plan.update(req.body, { where: { id: req.params.id } });
    return res.status(200).json(plan);
  }

  async delete(req, res) {
    const plan = await Plans.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ Error: "Plan doesn't exists!" });
    }

    await plan.destroy();
    return res.status(200).json(plan);
  }
}

export default new PlanController();
