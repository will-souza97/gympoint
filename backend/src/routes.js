import { Router } from 'express';

import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/admin', AdminController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/admin', AdminController.update);

routes.post('/student', StudentController.store);
routes.put('/student', StudentController.update);

export default routes;
