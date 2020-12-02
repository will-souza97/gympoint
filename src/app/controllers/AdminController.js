import * as Yup from 'yup';
import Admin from '../models/Admin';

class AdminController {
  /* Criar um novo Administrador */
  async store(req, res) {
    /* Vereficar se o req.body está com todos os dados preenchidos */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(8),
    });

    /* Se algum dado não corresponder a validação, então será retornado um erro */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation failed' });
    }

    /* Vereficar se já existe algum Administrador com o mesmo email que 
      esta sendo informado no req.body */
    const adminExists = await Admin.findOne({
      where: { email: req.body.email },
    });

    /* Caso exista ira retorna um erro */
    if (adminExists) {
      return res.status(400).json({ Error: 'This Admin already exists' });
    }

    const { id, name, email } = await Admin.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    /* Atualizar um Administrador já existente */
    const schema = Yup.object().shape({
      /* Vereficar se o req.body está com todos os dados preenchidos e caso o Administrador 
        queira atualiza sua senha ele deverár informar a senha anterio, em seguida informar 
        a nova senha e por fim confirma-la */
      name: Yup.string(),
      email: Yup.string().required().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    /* Se algum dado não corresponder a validação, então será retornado um erro */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation failed' });
    }

    /* Vereficar se o Administrador já existe */
    const admin = await Admin.findByPk(req.adminId);

    /* Caso não exista irá retornar um erro */
    if (!admin) {
      return res.status(400).json({ Error: "This Admin doesn't exists!" });
    }

    const { email, oldPassword } = req.body;

    /* Vereficar se o email informado no req.body é diferente ao email 
      do Administrador informado  */
    if (email !== admin.email) {
      /* Caso seja diferente irá vereficar se esse email já pertence a outro Administrador */
      const adminExists = await Admin.findOne({ where: { email } });

      /* Se pertencer a outro Administrador, irá um erro */
      if (adminExists) {
        return res.status(400).json({ Error: 'This Admin already exists' });
      }
    }

    /* Vereficar se a senha antiga esta correta */
    if (oldPassword && !(await admin.checkPassword(oldPassword))) {
      /* Caso esteja incorreta irá retornar um erro */
      return res.status(401).json({
        Error:
          'Password or oldPassword was not entered correctly or does not match',
      });
    }

    await admin.update(req.body, { where: req.adminId });

    return res.json({ id: admin.id, name: admin.name, email: admin.email });
  }
}

export default new AdminController();
