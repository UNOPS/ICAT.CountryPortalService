import { MailerService } from '@nestjs-modules/mailer';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';

const fs = require('fs');

@Injectable()
export class EmailNotificationService {
  constructor(private readonly mailerService: MailerService) {}

  from = 'no-reply-icat-ca-tool@climatesi.com';

  async sendMail(
    to: string,
    subject: string,
    text: string,
    emailTemplate = '',
  ) {
    this.mailerService
      .sendMail({
        to: to,
        from: this.from,
        subject: subject,
        text: text,
        html: emailTemplate,
      })
      .then((res) => {})
      .catch((e) => {});
  }
}
