import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialDto } from './Dto/auth.credential.dto';
import { ResetPassword } from './Dto/reset.password.dto';
import { ForgotPasswordDto } from './Dto/forgot.passowrd.dto';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { AuditService } from 'src/audit/audit.service';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

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
    return await this.usersService.validateResetPasswordRequest(email, token);
  }

  @Put('auth/reset-password')
  async resetPassword(@Body() resetPwd: ResetPassword): Promise<boolean> {
    if (
      await this.usersService.validateResetPasswordRequest(
        resetPwd.email,
        resetPwd.token,
      )
    ) {
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
    let user = await this.usersService.findUserByEmail(forgotparam.email);

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

    let emailTemplate = '';

    emailTemplate = fs.readFileSync(
      './src/template/email/reset-password.html',
      'utf8',
    );

    const resetPwdUrl = this.configService.get<string>(
      process.env.PWD_RESET_URL,
    );

    emailTemplate = emailTemplate.replace(
      '[RESER_PWD_URL]',
      resetPwdUrl + '?token=' + pwdRestToken + '&email=' + forgotparam.email,
    );

    this.emailService.sendMail(
      user.email,
      'Reset your ncc-dsn login password',
      '',
      emailTemplate,
    );

    return response.status(200).send(true);
  }
}
