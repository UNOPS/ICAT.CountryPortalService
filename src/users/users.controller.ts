import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
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
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
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

    // this works
    // filter: {
    //   id: {
    //     $eq: 1,
    //   }
    // }
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
    private readonly auditService:AuditService,
    private readonly tokenDetails:TokenDetails,
    
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: User): Promise<User> {
    let audit: AuditDto = new AuditDto();
    audit.action = createUserDto.username+' Created';
    audit.comment = "User Created";
    audit.actionStatus = 'Created';
    this.auditService.create(audit);
    return this.service.create(createUserDto);
  }

  // @Get()
  // findAll(): Promise<User[]> {
  //   return this.service.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<User> {
  //   return this.service.findOne(id);
  // }

  @Get('isUserAvailable/:userName')
  async isUserAvailable(@Param('userName') userName: string): Promise<boolean> {
    return await this.service.isUserAvailable(userName);
  }

  @Get('findUserByUserName/:userName')
  async findUserByUserName(@Param('userName') userName: string): Promise<any> {
    console.log(userName);

    console.log('test', this.service.findByUserName(userName));
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
  changeStatus( @Query('id') id:number, @Query('status') status:number): Promise<User> {
   console.log('status',status)
   
    return this.service.chnageStatus(id,status);
  }


  

  @Override()
  async getMany(@ParsedRequest() req: CrudRequest, @Request() req2) {
    // let userEmail = req2.user.email;

    // let currentDBUser = await this.usersRepository.findOne({ where: { email: userEmail } });

    // if (currentDBUser.userType.id != 1) {
    //   // not ccs admin , linit data for the users' institution
    //   if (currentDBUser.userType.id == 4) {
    //     /// doe
    //     req.parsed.search['$and'].push({ 'id': (currentDBUser).id });

    //   }
    //   else {
    //     req.parsed.search['$and'].push({ 'institution.id': (currentDBUser).institution.id });

    //   }
    // }
    console.log('yyyyyyyyyyyyyyyyyyyyyyyy');
    console.log(req.parsed.filter.length, req.parsed.search['$and'][0]);

    let userList = this.base.getManyBase(req);

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
   
    
    let countryIdFromTocken:number;
    let sectorIdFromTocken:number ;
    let institutionIdFromTocken:number ;
    let role:string;
  

   [countryIdFromTocken,sectorIdFromTocken,institutionIdFromTocken,role]=    this.tokenDetails.getDetails([TokenReqestType.countryId,TokenReqestType.sectorId,TokenReqestType.InstitutionId,TokenReqestType.role])
    
    console.log('incontroler...');
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
      role
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
    console.log('incontroler...');
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
