import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      idade: Yup.string().required().min(1),
      peso: Yup.string().required(),
      altura: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation failed' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ Error: 'This Student already exists' });
    }

    const { id, name, email, idade, peso, altura } = await Student.create(
      req.body
    );

    return res.status(201).json({ id, name, email, idade, peso, altura });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      idade: Yup.string().min(1),
      peso: Yup.string(),
      altura: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation failed' });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ Error: "This Student doesn't  exists" });
    }

    const { email } = req.body;

    if (email && email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ Error: 'This Student already exists' });
      }
    }

    await student.update(req.body, { where: req.params.id });
    return res.status(200).json(student);
  }
}

export default new StudentController();
