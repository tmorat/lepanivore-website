import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (environmentConfigService: EnvironmentConfigService) => ({
        transport: {
          host: environmentConfigService.get('SMTP_HOST'),
          port: environmentConfigService.get('SMTP_PORT'),
          tls: {
            ciphers: 'SSLv3',
          },
          secure: false, // true for 465, false for other ports
          auth: {
            user: environmentConfigService.get('SMTP_USERNAME'),
            pass: environmentConfigService.get('SMTP_PASSWORD'),
          },
        },
      }),
    }),
  ],
})
export class MailerConfigModule {}
