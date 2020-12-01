import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { student, plan, enrollment } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Parabens, sua Matricula foi efetuada com Sucesso! 🎉️🎉️',
      template: 'subscription',
      context: {
        student: student.name,
        plan: plan.title,
        duration: {
          numberMonths: plan.duration,
          months: plan.duration > 1 ? `Meses` : `Mes`,
        },
        totalPrice: enrollment.price,
        priceMonth: plan.price,
        start_date: format(
          parseISO(enrollment.start_date),
          "'Dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(enrollment.end_date),
          "'Dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}
export default new SubscriptionMail();
