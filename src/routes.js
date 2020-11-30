import { Router } from 'express';

import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswersController from './app/controllers/AnswersController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/admin', AdminController.store);
routes.put('/admin', AdminController.update);

routes.post('/student', StudentController.store);
routes.put('/student/:id', StudentController.update);

routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/enrollment', EnrollmentController.index);
routes.get('/enrollment/:id', EnrollmentController.show);
routes.post('/enrollment', EnrollmentController.store);
routes.put('/enrollment/:id', EnrollmentController.update);
routes.delete('/enrollment/:id', EnrollmentController.delete);

routes.get('/student/:id/checkin', CheckinController.index);
routes.post('/student/:id/checkin', CheckinController.store);

routes.post('/help-orders/:id/answer', AnswersController.store);

routes.get('/student/:id/help-orders', HelpOrderController.index);
routes.post('/student/:id/help-orders', HelpOrderController.store);
routes.put('/student/:id/help-orders', HelpOrderController.update);

export default routes;
