import { Body, Controller, Get, Param, Put, Res } from '@nestjs/common';
import { Request, Post, UseGuards } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialDto } from './Dto/auth.credential.dto';
import { ResetPassword } from './Dto/reset.password.dto';
import { ForgotPasswordDto } from './Dto/forgot.passowrd.dto';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { AuditService } from 'src/audit/audit.service';

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
    private emailService: EmailNotificationService,
    private readonly auditService: AuditService,
  ) {}

  @Post('auth/login')
  async login(@Body() authCredentialDto: AuthCredentialDto): Promise<any> {
    //return req.user;
    console.log('AppController.login');
    console.log('AppController.login', authCredentialDto);
    const audit: AuditDto = new AuditDto();
    audit.userName = authCredentialDto.username;
    audit.action = authCredentialDto.username + ' Logged In';
    audit.comment = 'User Log In';
    audit.actionStatus = 'Log In';
    this.auditService.create(audit);

    return await this.authService.login(authCredentialDto);
  }

  @Get('auth/validate-reset-password/:email/:token')
  async validateResetPassword(
    @Param('email') email: string,
    @Param('token') token: string,
  ): Promise<boolean> {
    console.log('inside');

    return await this.usersService.validateResetPasswordRequest(email, token);
  }

  @Put('auth/reset-password')
  async resetPassword(@Body() resetPwd: ResetPassword): Promise<boolean> {
    console.log('resetPwd', resetPwd);

    if (
      await this.usersService.validateResetPasswordRequest(
        resetPwd.email,
        resetPwd.token,
      )
    ) {
      console.log('is valid');

      const res = await this.usersService.resetPassword(
        resetPwd.email,
        resetPwd.password,
      );

      return res;
    }
    return false;
  }

  @Post('auth/forgot-password')
  async forgotPassword(
    @Body() forgotparam: ForgotPasswordDto,
    @Res() response: any,
  ): Promise<any> {
    //return req.user;
    console.log('forgotPassword=========', forgotparam);
    let user = await this.usersService.findUserByEmail(forgotparam.email);
    console.log('resultData=========', user);

    if (!user) {
      const errorResponse: any = {
        status: 0,
        message: 'Invalid Email/User Id',
      };
      return response.status(400).send(errorResponse);
    }

    const pwdRestToken = uuidv4();

    user = await this.usersService.updateChnagePasswordToken(
      user.id,
      pwdRestToken,
    );

    console.log('updateChnagePasswordToken user=========', user);

    let emailTemplate = '';

    emailTemplate = fs.readFileSync(
      './src/template/email/reset-password.html',
      'utf8',
    );

    // get an environment variable
    const resetPwdUrl = this.configService.get<string>('PWD_RESET_URL');

    console.log('PWD_RESET_URL', resetPwdUrl);

    emailTemplate = emailTemplate.replace(
      '[RESER_PWD_URL]',
      resetPwdUrl + '?token=' + pwdRestToken + '&email=' + forgotparam.email,
    );

    // sned email with new password
    this.emailService.sendMail(
      user.email,
      'Reset your ncc-dsn login password',
      '',
      emailTemplate,
    );

    return response.status(200).send(true);
  }
}
