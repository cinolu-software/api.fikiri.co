import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from '../users/entities/user.entity';

@Injectable()
export class callsEmailService {
  constructor(private readonly mailerSerive: MailerService) {}

  @OnEvent('add-reviewer')
  async reviewEmail({ user, link }: { user: User; link: string }): Promise<void> {
    try {
      await this.mailerSerive.sendMail({
        to: user.email,
        subject: "Invitation à l'évaluation Fikiri",
        template: 'add-reviewer',
        context: { user, link }
      });
    } catch {
      throw new BadRequestException();
    }
  }
}
