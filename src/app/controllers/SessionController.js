import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import Admin from '../models/Admin';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required().min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation failed' });
    }

    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({ Error: 'Admin not Found' });
    }

    if (!(await admin.checkPassword(password))) {
      return res.status(401).json({ Error: 'Password does not match' });
    }

    const { id, name } = admin;

    return res.json({
      admin: { id, name, email },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
