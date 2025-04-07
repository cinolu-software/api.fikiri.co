import { Module } from '@nestjs/common';
import { AuthEmailService } from './auth-email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { callsEmailService } from './calls-email.service';
import { UsersEmailService } from './users-email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          secure: true,
          host: config.get('MAIL_HOST'),
          port: Number(config.get('MAIL_PORT')),
          auth: {
            user: config.get('MAIL_USERNAME'),
            pass: config.get('MAIL_PASSWORD')
          }
        },
        defaults: {
          from: `Support FIKIRI <${config.get('MAIL_USERNAME')}>`
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      })
    })
  ],
  providers: [AuthEmailService, callsEmailService, UsersEmailService]
})
export class EmailModule {}
