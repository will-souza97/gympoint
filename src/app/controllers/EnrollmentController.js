import * as Yup from 'yup';
import { startOfDay, parseISO, isBefore, addMonths, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Student from '../models/Student';
import Plans from '../models/Plans';
import Enrollment from '../models/Enrollment';

import Mail from '../../lib/Mail';

class EnrollmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollments = await Enrollment.findAll({
      attributes: [
        'id',
        'start_date',
        'end_date',
        'student_id',
        'plan_id',
        'price',
      ],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Plans,
          as: 'plan',
          attributes: ['title'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async show(req, res) {
    const enrollment = await Enrollment.findOne({
      where: { id: req.params.id },
      attributes: [
        'id',
        'start_date',
        'end_date',
        'student_id',
        'plan_id',
        'price',
      ],
      include: [
        {
          model: Plans,
          as: 'plan',
          attributes: ['title'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!enrollment) {
      return res.status(400).json({ Error: "This Enrollment doesn't exists!" });
    }

    return res.json(enrollment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation failed' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ Error: "This Student doesn't exists" });
    }

    const plan = await Plans.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ Error: "This Plan doesn't exists" });
    }

    const enrollmentExist = await Enrollment.findOne({
      where: { student_id },
    });

    if (enrollmentExist) {
      return res
        .status(400)
        .json({ Error: 'This Student already has an enrollment' });
    }

    const dayStart = startOfDay(parseISO(start_date));

    if (isBefore(dayStart, new Date())) {
      return res.status(400).json({ Error: "Past dates aren't permitted" });
    }

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date: addMonths(parseISO(start_date), plan.duration),
      price: plan.duration * plan.price,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Cadastro Realizado com Sucesso',
      template: 'subscription',
      context: {
        student: student.name,
        plan: plan.title,
        end_date: format(enrollment.end_date, "'Dia' dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        totalPrice: enrollment.price,
        priceMonth: plan.price,
      },
    });

    return res.status(201).json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation failed' });
    }

    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(400).json({ Error: "This Enrollment doesn't exists" });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ Error: "This Student doesn't exists" });
    }

    const plan = await Plans.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ Error: "This Plan doesn't exists" });
    }

    const dayStart = startOfDay(parseISO(start_date));

    if (isBefore(dayStart, new Date())) {
      return res.status(400).json({ Error: "Past dates aren't permitted" });
    }

    await enrollment.update(
      {
        plan_id,
        start_date,
        end_date: addMonths(parseISO(start_date), plan.duration),
        price: plan.duration * plan.price,
      },
      { where: { id: req.params.id } }
    );

    return res.status(200).json(enrollment);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(400).json({ Error: "Enrollment doesn't exists!" });
    }

    await enrollment.destroy();
    return res.status(200).json(enrollment);
  }
}
export default new EnrollmentController();
