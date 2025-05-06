import { Module } from '@nestjs/common';
import { AuthEmailService } from './auth-email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { callsEmailService } from './calls-email.service';
import { UsersEmailService } from './users-email.service';
import { config } from 'dotenv';

config({
  path: '.env'
});

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        secure: true,
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
      },
      defaults: {
        from: `Support FIKIRI <${process.env.MAIL_USERNAME}>`
      },
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    })
  ],
  providers: [AuthEmailService, callsEmailService, UsersEmailService]
})
export class EmailModule {}
