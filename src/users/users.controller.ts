import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
  ParsedBody,
} from '@nestjsx/crud';
import { request } from 'http';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Institution } from 'src/institution/institution.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { getConnection, Repository } from 'typeorm';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  query: {
    join: {
      institution: {
        eager: true,
      },
      userType: {
        eager: true,
      },
      country: {
        eager: true,
      },
    },
  },
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(
    public service: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserDto: User): Promise<User> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const audit: AuditDto = new AuditDto();
      const user = this.service.create(createUserDto);
      audit.action = createUserDto.username + ' Created';
      audit.comment = 'User Created';
      audit.actionStatus = 'Created';
      this.auditService.create(audit);
      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.service.findOne(id);
  }

  @Override()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() newUser: User,
  ): Promise<User | null> {
    const user = await this.userRepository.findOneOrFail(id);
    if (!user.id) {
      console.error("User doesn't exist");
    }
    Object.assign(user, newUser);
    this.userRepository.save(user);
    return await this.userRepository.findOne(id);
  }

  @Get('isUserAvailable/:userName')
  async isUserAvailable(@Param('userName') userName: string): Promise<boolean> {
    return await this.service.isUserAvailable(userName);
  }

  @Get('findUserByUserName/:userName')
  async findUserByUserName(@Param('userName') userName: string): Promise<any> {
    return await this.service.findUserByUserName(userName);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.service.remove(id);
  }

  get base(): CrudController<User> {
    return this;
  }

  @Patch('changeStatus')
  changeStatus(
    @Query('id') id: number,
    @Query('status') status: number,
  ): Promise<User> {
    return this.service.chnageStatus(id, status);
  }

  @Override()
  async getMany(@ParsedRequest() req: CrudRequest, @Request() req2) {
    const userList = this.base.getManyBase(req);

    return userList;
  }
  @UseGuards(JwtAuthGuard)
  @Get('AllUserDetails/userDetalils/:page/:limit/:filterText/:userTypeId')
  async AllUserDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('userTypeId') userTypeId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let institutionIdFromTocken: number;
    let role: string;

    [countryIdFromTocken, sectorIdFromTocken, institutionIdFromTocken, role] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.InstitutionId,
        TokenReqestType.role,
      ]);

    return await this.service.getUserDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      userTypeId,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionIdFromTocken,
      role,
    );
  }

  @Get(
    'UsersByInstitution/userDetalils/:page/:limit/:filterText/:userTypeId/:institutionId',
  )
  async UsersByInstitution(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('userTypeId') userTypeId: number,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.service.getUserDetailsByInstitution(
      {
        limit: limit,
        page: page,
      },
      filterText,
      userTypeId,
      userName,
    );
  }
}
