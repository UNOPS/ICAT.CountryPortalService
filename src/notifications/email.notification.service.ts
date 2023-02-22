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
        to: to, //user.email, // list of receivers
        from: this.from, // sender address
        subject: subject, // Subject line
        text: text, // plaintext body
        html: emailTemplate, // HTML body content
      })
      .then((res) => {
        console.log('email sent sent ===============', res);
      })
      .catch((e) => {
        console.log('email error =====================', e);
      });
  }

  // async sendnewDataRequesteEmailParameter( parameterLocationData : ParameterLocationData  ) {

  //     let pl = this.paramterLocationService.findOne(parameterLocationData.parameterLocation.id)

  //     let users = await this.usersService.find({where : {institution : {id: (await pl).dataSource.id},userType : 3}});

  //     let paramter = await this.paramterService.findOne(parameterLocationData.parameterId)

  //     let emailTemplate = "";

  //     emailTemplate = fs.readFileSync('./src/template/email/data-request-parameter.html', 'utf8');

  //     // emailTemplate = emailTemplate.replace("[USER_NAME]", `${user.title} ${user.firstName} ${user.lastName}`  );
  //     emailTemplate = emailTemplate.replace("[USER_NAME]", `Institution Admin`  );
  //     emailTemplate = emailTemplate.replace("[Paramter_Name]", paramter.name );
  //     emailTemplate = emailTemplate.replace("[from]", moment( parameterLocationData.startDate).format("YYYY MMM DD") );
  //     emailTemplate = emailTemplate.replace("[to]",  moment( parameterLocationData.endDate).format("YYYY MMM DD") );
  //     emailTemplate = emailTemplate.replace("[Deadline]", moment( parameterLocationData.deadline).format("YYYY MMM DD") );

  //     // sned email
  //     this
  //         .mailerService
  //         .sendMail({
  //             to: users.map(a => a.email),//user.email, // list of receivers
  //             from: 'no-reply-ncc-dsn@climatesi.com', // sender address
  //             subject: 'ncc-dsn : parameter data request', // Subject line
  //             //text: 'Your new wealth manager login password is : ' + tempPassword, // plaintext body
  //             html: emailTemplate, // HTML body content
  //         })
  //         .then((res) => {
  //             console.log("email sent sendnewDataRequesteEmailParameter ===============", res);
  //         })
  //         .catch((e) => {
  //             console.log("email error sendnewDataRequesteEmailParameter =====================", e);
  //         });
  // }

  // async sendnewDataEntryRequesteEmailParameter( parameterLocationData : ParameterLocationData  ) {

  //     let pl = this.paramterLocationService.findOne(parameterLocationData.parameterLocation.id)

  //     let user = await this.usersService.findOne({where :  {id : parameterLocationData.dataEntryUser.id}});

  //     let paramter = await this.paramterService.findOne(parameterLocationData.parameterId)

  //     let emailTemplate = "";

  //     emailTemplate = fs.readFileSync('./src/template/email/data-entry-request-parameter.html', 'utf8');

  //     emailTemplate = emailTemplate.replace("[USER_NAME]", `${user.title} ${user.firstName} ${user.lastName}`  );
  //     emailTemplate = emailTemplate.replace("[Paramter_Name]", paramter.name );
  //     emailTemplate = emailTemplate.replace("[from]", moment( parameterLocationData.startDate).format("YYYY MMM DD") );
  //     emailTemplate = emailTemplate.replace("[to]",  moment( parameterLocationData.endDate).format("YYYY MMM DD") );
  //     emailTemplate = emailTemplate.replace("[Deadline]", moment( parameterLocationData.dataEnteryDeadline).format("YYYY MMM DD") );

  //     // sned email
  //     this
  //         .mailerService
  //         .sendMail({
  //             to: user.email,//user.email, // list of receivers
  //             from: 'no-reply-ncc-dsn@climatesi.com', // sender address
  //             subject: 'ncc-dsn : parameter data entry request', // Subject line
  //             //text: 'Your new wealth manager login password is : ' + tempPassword, // plaintext body
  //             html: emailTemplate, // HTML body content
  //         })
  //         .then((res) => {
  //             console.log("email sent sendnewDataRequesteEmailParameter ===============", res);
  //         })
  //         .catch((e) => {
  //             console.log("email error sendnewDataRequesteEmailParameter =====================", e);
  //         });
  // }
}
