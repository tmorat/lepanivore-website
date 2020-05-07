import { MailerService } from '@nestjs-modules/mailer';
import { OrderNotification } from '../../../domain/order-notification/order-notification';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { EmailOrderNotificationRepository } from '../email-order-notification.repository';

describe('infrastructure/repositories/EmailOrderNotificationRepository', () => {
  let emailOrderNotificationRepository: EmailOrderNotificationRepository;
  let mockMailerService: MailerService;
  let mockEnvironmentConfigService: EnvironmentConfigService;

  beforeEach(() => {
    mockMailerService = {} as MailerService;
    mockMailerService.sendMail = jest.fn();

    mockEnvironmentConfigService = {} as EnvironmentConfigService;
    mockEnvironmentConfigService.get = jest.fn();

    emailOrderNotificationRepository = new EmailOrderNotificationRepository(mockMailerService, mockEnvironmentConfigService);
  });

  describe('send()', () => {
    it('should send mail with options built from order notification and configuration', async () => {
      // given
      const orderNotification: OrderNotification = {
        subject: 'order notification subject',
        body: 'order notification body',
      };

      (mockEnvironmentConfigService.get as jest.Mock).mockImplementation((key: string) => {
        switch (key) {
          case 'APP_EMAIL_ORDER_NOTIFICATION_FROM':
            return 'from@example.org';
          case 'APP_EMAIL_ORDER_NOTIFICATION_TO':
            return 'to@example.org';
          default:
            return null;
        }
      });

      // when
      await emailOrderNotificationRepository.send(orderNotification);

      // then
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: 'from@example.org',
        to: 'to@example.org',
        subject: 'order notification subject',
        text: 'order notification body',
      });
    });
  });
});
