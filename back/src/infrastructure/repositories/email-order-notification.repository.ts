import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OrderNotificationInterface } from '../../domain/order-notification.interface';
import { OrderNotificationRepository } from '../../domain/order-notification.repository';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';

@Injectable()
export class EmailOrderNotificationRepository implements OrderNotificationRepository {
  constructor(private readonly mailerService: MailerService, private readonly environmentConfigService: EnvironmentConfigService) {}

  async send(orderNotification: OrderNotificationInterface): Promise<void> {
    await this.mailerService.sendMail({
      from: this.environmentConfigService.get('APP_EMAIL_ORDER_NOTIFICATION_FROM'),
      to: this.environmentConfigService.get('APP_EMAIL_ORDER_NOTIFICATION_TO'),
      subject: orderNotification.subject,
      text: orderNotification.body,
    });
  }
}
