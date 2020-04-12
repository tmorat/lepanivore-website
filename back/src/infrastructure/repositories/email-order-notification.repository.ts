import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OrderNotification } from '../../domain/order-notification';
import { OrderNotificationRepository } from '../../domain/order-notification.repository';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';

@Injectable()
export class EmailOrderNotificationRepository implements OrderNotificationRepository {
  constructor(private readonly mailerService: MailerService, private readonly environmentConfigService: EnvironmentConfigService) {}

  async send(orderNotification: OrderNotification): Promise<void> {
    await this.mailerService.sendMail({
      from: this.environmentConfigService.get('APP_EMAIL_ORDER_NOTIFICATION_FROM'),
      to: orderNotification.recipient,
      cc: this.environmentConfigService.get('APP_EMAIL_ORDER_NOTIFICATION_CC'),
      subject: orderNotification.subject,
      text: orderNotification.body,
    });
  }
}
