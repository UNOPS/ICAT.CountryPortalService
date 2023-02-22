import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { count } from 'console';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcript from 'bcrypt';
import { ResetPassword } from 'src/auth/Dto/reset.password.dto';
import { RSA_PSS_SALTLEN_MAX_SIGN } from 'constants';
import { UserType } from './user.type.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Institution } from 'src/institution/institution.entity';
import { RecordStatus } from 'src/shared/entities/base.tracking.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Country } from 'src/country/entity/country.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { InstitutionCategory } from 'src/institution/institution.category.entity';
import { InstitutionType } from 'src/institution/institution.type.entity';

const { v4: uuidv4 } = require('uuid');

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repo,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
    @InjectRepository(UserType)
    private readonly usersTypeRepository: Repository<UserType>,
    private readonly emaiService: EmailNotificationService,
    private configService: ConfigService,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
  ) {
    super(repo);
  }

  async create(createUserDto: User): Promise<User> {
    console.log('dddddddddddddddd');
    console.log(createUserDto);
    const userType = await this.usersTypeRepository.findOne(
      createUserDto.userType.id,
    );

    console.log(userType);

    const institution = await this.institutionRepository.findOne(
      createUserDto.institution.id,
    );

    //To-do get country id from current context
    // let countryId = 1;
    // let country = await this.countryRepo.findOne(countryId);

    const newUser = new User();

    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.username = createUserDto.username;
    newUser.email = createUserDto.email;
    newUser.mobile = createUserDto.mobile;
    newUser.status = RecordStatus.Active;
    newUser.telephone = createUserDto.telephone;
    newUser.userType = userType;
    newUser.institution = institution;
    newUser.country = createUserDto.country;
    newUser.designation = createUserDto.designation;

    newUser.salt = await bcript.genSalt();

    const newUUID = uuidv4();
    const newPassword = ('' + newUUID).substr(0, 6);
    createUserDto.password = newPassword;
    newUser.password = await this.hashPassword(
      createUserDto.password,
      newUser.salt,
    );
    //newUser.password = '12345';
    newUser.resetToken = '';

    const newUserDb = await this.usersRepository.save(newUser);
    // get an environment variable
    const systemLoginUrl = this.configService.get<string>('LOGIN_URL');

    const template =
      'Dear ' +
      newUserDb.firstName +
      ' ' +
      newUserDb.lastName +
      ' <br/>Your username is ' +
      newUserDb.email +
      ' and your new login password is : ' +
      newPassword +
      ' <br/>System login url is ' +
      systemLoginUrl;
    '<br/>' + '<br/>Best regards' + '<br/>Software support team';

    // sned email with new password
    this.emaiService.sendMail(
      newUserDb.email,
      'Your credentials for ICAT system',
      '',
      template,
    );

    newUserDb.password = '';
    newUserDb.salt = '';

    return newUserDb;
  }

  async chnagePassword(userId: number, newPassword: string): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    user.password = newPassword;
    return this.usersRepository.save(user);
  }

  async chnageStatus(userId: number, status: number): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    user.status = status;
    return this.usersRepository.save(user);
  }

  async updateChnagePasswordToken(
    userId: number,
    newToken: string,
  ): Promise<User> {
    const systemLoginUrl = this.configService.get<string>('ClientURl');
    const user = await this.usersRepository.findOne(userId);
    user.resetToken = newToken;
    const newUUID = uuidv4();
    const newPassword = ('' + newUUID).substr(0, 6);
    user.password = await this.hashPassword(user.password, user.salt);
    user.password = newPassword;
    this.usersRepository.save(user);
    const template =
      'Dear ' +
      user.firstName +
      ' ' +
      user.lastName +
      ' <br/>Your username is ' +
      user.email +
      ' and your new login password is : ' +
      newPassword +
      ' <br/>System login url is ' +
      '<a href="systemLoginUrl">' +
      systemLoginUrl;
    '<br/>' + '<br/>Best regards' + '<br/>Software support team';

    this.emaiService.sendMail(
      user.email,
      'Your credentials for ICAT system',
      '',
      template,
    );

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findByUserName(userName: string): Promise<User> {
    return this.usersRepository.findOne({ username: userName });
  }

  async validateUser(userName: string, password: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ username: userName });

    console.log('user', user);

    if (user != undefined) {
      return (await user).validatePassword(password);
    }
  }

  // findOne(id: string): Promise<User> {
  //   return this.usersRepository.findOne(id);
  // }

  async isUserAvailable(userName: string): Promise<any> {
    // await this.usersRepository.count({username: userName}).then((value)=>{
    //   if(value>0){
    //     return true;
    //   }
    //   else{
    //     return false;
    //   }
    // }).catch(()=>{
    //   return false;
    // });
    const user = await this.usersRepository.findOne({ username: userName });
    if (user) {
      console.log('UsersService.findByUserName : true ===============');

      return user;
    } else {
      console.log('UsersService.findByUserName : false ===============');

      return user;
    }
  }

  async findUserByUserName(userName: string): Promise<any> {
    return await this.usersRepository
      .findOne({ username: userName })
      .then((value) => {
        console.log(value);
        if (!!value) {
          console.log('inside', value.id);

          return value;
        } else {
          return 0;
        }
      })
      .catch(() => {
        return 0;
      });
  }

  async findUserByEmail(email: string): Promise<any> {
    return await this.usersRepository
      .findOne({ email: email })
      .then((value) => {
        console.log(value);
        if (!!value) {
          console.log('inside', value.id);

          return value;
        } else {
          return false;
        }
      })
      .catch((e) => {
        console.log('findUserByEmail error', e);
        return false;
      });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id + '');
  }

  async validateResetPasswordRequest(
    email: string,
    token: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: email });
    console.log(user);

    if (user && user.resetToken === token) {
      console.log('in if ');

      return true;
    } else {
      console.log('in else');

      return false;
    }
  }

  async resetPassword(email: string, password: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: email });
    console.log(user);
    if (user) {
      const salt = await bcript.genSalt();
      console.log('password', password, 'salt', salt);
      user.salt = salt;
      user.password = await this.hashPassword(password, salt);
      console.log('inside success');

      await this.usersRepository.save(user);

      console.log('inside success2');

      await this.updateChnagePasswordToken(user.id, ''); // clean the tocken

      console.log('inside success3');

      return true;
    }
    console.log('inside fail');

    return false;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcript.hash(password, salt);
  }

  async getUserDetails(
    options: IPaginationOptions,
    filterText: string,
    userTypeId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionIdFromTocken: number,
    role: string,
  ): Promise<Pagination<User>> {
    console.log('calling......');
    let filter = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(user.firstName LIKE :filterText OR user.lastName LIKE :filterText OR user.telephone LIKE :filterText OR user.email LIKE :filterText OR ins.name LIKE :filterText OR type.name LIKE :filterText)';
    }

    if (userTypeId != 0) {
      if (filter) {
        filter = `${filter} and user.userTypeId = :userTypeId`;
      } else {
        filter = `user.userTypeId = :userTypeId`;
      }
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and user.countryId = :countryIdFromTocken`;
      } else {
        filter = `user.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken != 0) {
      console.log('sectorIdFromTocken');

      if (filter) {
        filter = `${filter}  and ins.sectorId = :sectorIdFromTocken and type.id not in ( 1, 2)`;
      } else {
        filter = `ins.sectorId = :sectorIdFromTocken and type.id not in (1,2)`;
      }
    }

    if (institutionIdFromTocken != 0) {
      console.log('user Query');
      if (filter) {
        filter = `${filter}  and user.institutionId = :institutionIdFromTocken `;
      } else {
        filter = `user.institutionId = :institutionIdFromTocken`;
      }
    }

    // if (role == "Country Admin") {

    // }
    // else if (role == "Sector Admin") {
    //   console.log("Sector Admin")
    //   if (filter) {
    //     filter = `${filter}  and user.userTypeId not in (1)`;
    //   } else {
    //     filter = `user.userTypeId not in (1) `;
    //   }
    // }
    // else if (role == "MRV Admin") {
    //   console.log("MRV Admin")
    //   if (filter) {
    //     filter = `${filter}  and user.userTypeId not in (1,2)`;
    //   } else {
    //     filter = `user.userTypeId not in (1,2) `;
    //   }
    // }
    // else if (role == "Technical Team" ) {
    //   console.log("Technical Team")
    //   if (filter) {
    //     filter = `${filter}  and user.userTypeId = 3 `;
    //   } else {
    //     filter = `user.userTypeId = 3 `;
    //   }
    // }
    // else if ( role ==   "QC Team") {
    //   console.log("Technical Team")
    //   if (filter) {
    //     filter = `${filter}  and user.userTypeId = 3 `;
    //   } else {
    //     filter = `user.userTypeId = 3 `;
    //   }
    // }
    // else
    if (role == 'Data Collection Team') {
      if (filter) {
        filter = `${filter}  and user.userTypeId = 8 or user.userTypeId = 9 `;
      } else {
        filter = `user.userTypeId = 8 or user.userTypeId = 9 `;
      }
    }

    // else {

    // }

    const data = this.repo
      .createQueryBuilder('user')
      .leftJoinAndMapOne(
        'user.institution',
        Institution,
        'ins',
        'ins.id = user.institutionId',
      )
      .leftJoinAndMapOne(
        'user.userType',
        UserType,
        'type',
        'type.id = user.userTypeId',
      )

      .where(filter, {
        filterText: `%${filterText}%`,
        userTypeId,
        countryIdFromTocken,
        sectorIdFromTocken,
        institutionIdFromTocken,
      })
      .orderBy('user.status', 'ASC')
      .groupBy('user.id');

    const resualt = await paginate(data, options);

    if (resualt) {
      // console.log('reaslt...', resualt);
      return resualt;
    }
  }

  async getUserDetailsByInstitution(
    options: IPaginationOptions,
    filterText: string,
    userTypeId: number,
    userName: string,
  ): Promise<Pagination<User>> {
    const user = await this.usersRepository.findOne({ username: userName });
    const institutionId = user ? user.institution.id : 0;

    console.log('calling......');
    const filter = '';

    // if (filterText != null && filterText != undefined && filterText != '') {
    //   filter =
    //     '(user.firstName LIKE :filterText OR user.lastName LIKE :filterText OR user.telephone LIKE :filterText OR user.email LIKE :filterText OR ins.name LIKE :filterText OR type.name LIKE :filterText)';
    // }

    // if (userTypeId != 0) {
    //   if (filter) {
    //     filter = `${filter} and user.userTypeId = :userTypeId`;
    //   } else {
    //     filter = `user.userTypeId = :userTypeId`;
    //   }
    // }

    const data = this.repo
      .createQueryBuilder('user')
      .leftJoinAndMapOne(
        'user.institution',
        Institution,
        'ins',
        'ins.id = user.institutionId',
      )
      .leftJoinAndMapOne(
        'user.userType',
        UserType,
        'type',
        'type.id = user.userTypeId',
      )

      .where(' type.id=' + userTypeId + ' AND ins.id=' + institutionId)
      .orderBy('user.status', 'ASC');
    const SQLString = data.getSql();
    console.log('SQLString', SQLString);
    const resualt = await paginate(data, options);

    if (resualt) {
      console.log('reaslt...', resualt);
      return resualt;
    }
  }
}
