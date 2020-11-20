import { Router } from 'express';

import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/admin', AdminController.store);
routes.put('/admin', AdminController.update);

routes.post('/student', StudentController.store);
routes.put('/student', StudentController.update);

routes.post('/plans', PlanController.store);

export default routes;
