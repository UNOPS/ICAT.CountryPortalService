import {
  Controller,
  Get,
  Header,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { Repository } from 'typeorm';
import { AssesmentResaultService } from './assesment-resault.service';
import { AssessmentResault } from './entity/assessment-resault.entity';
import { AssessmentResultType } from './entity/assessment-result-type.entity';
import { getConnection } from 'typeorm';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

@Crud({
  model: {
    type: AssessmentResault,
  },
  query: {
    join: {
      assement: {
        eager: true,
      },
      assessmentYear: {
        eager: true,
      },
      projectionResult: {
        eager: true,
      },
    },
  },
})

@Controller('assesment-resault')


export class AssesmentResaultController
  implements CrudController<AssessmentResault>
{
  constructor(
    public service: AssesmentResaultService,
    @InjectRepository(Assessment)
    public assesmentRepo: Repository<Assessment>,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  get base(): CrudController<AssessmentResault> {
    return this;
  }

  @UseGuards(LocalAuthGuard)
  @Get(
    'assesment-resault/GetAssesmentResult/:AssessmentId/:AssessmentYearId/:calculate',
  )
  @ApiHeader({
    name: 'api-key',
    description: 'A Custom Header',
    schema: { type: 'string', default: '1234'} 
   
  }) 

  async GetAssesmentResult(
    @Query('AssessmentId') AssessmentId: number,
    @Query('AssessmentYearId') AssessmentYearId: number,
    @Query('calculate') calculate: boolean,
  ) {
    let restult = await this.service.GetAssesmentResult(
      AssessmentId,
      AssessmentYearId,
      calculate,
    );
    // console.log('dddddddddddddddddddddddddddddddddd');
    console.log('reeeee-----', restult);
    return restult;
  
  }

  @Get('assesment-resault/GetAllAssesmentResult/:AssessmentYearId')
  async GetAllAssesmentResult(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('AssessmentYearId') AssessmentYearId: number,
  ) {
    let restult = await this.service.GetAllAssesmentResult(
      {
        limit: limit,
        page: page,
      },
      AssessmentYearId,
    );
    // console.log('dddddddddddddddddddddddddddddddddd');
    // console.log(restult);
    return restult;
  }

  @Post(
    'assesment-resault/updateQCStatusAssesmentResult/:resultId/:yearId/:qcStatus/:assessmentResultType/:comment',
  )
  @UseGuards(JwtAuthGuard)
  async updateQCStatusAssesmentResult(
    @Query('resultId') resultId: number,
    @Query('yearId') yearId: number,
    @Query('qcStatus') qcStatus: number,
    @Query('assessmentResultType') assessmentResultType: number,
    @Query('comment') comment: string,
  ): Promise<AssessmentResault> {
    let audit: AuditDto = new AuditDto();
    audit.action = 'QC Status Assesment Result Updated';
    audit.comment = 'QC Status Assesment Result Updated';
    audit.actionStatus = 'Updated';

    this.auditService.create(audit);
    console.log('QC Status Assesment Result Updated');
    console.log('*******************');

    return await this.service.updateQCStatus(
      resultId,
      yearId,
      QuAlityCheckStatus[QuAlityCheckStatus[qcStatus]],
      AssessmentResultType[AssessmentResultType[assessmentResultType]],
      comment,
    );
  }


  @Get('macassesment-resault/qcupdate/:yearId/:qcStatus')
  async UpdateQcStatusForMac(
    @Query('yearId') yearId: number,
    @Query('qcStatus') qcStatus: number,
  ) {
    return await this.service.updateQCStatusforMac(
      
      yearId,
      qcStatus
     
    );
  }
  @Get('checkAllQCApprovmentAssessmentResult')
  async checkAllQCApprovmentAssessmentResult(
    @Query('assersltId') assersltId: number,
    
  ):Promise<boolean> {
    return await this.service.checkAllQCApprovmentAssessmentResult(
      assersltId
    );
  }

  @Get('macassesment-resault/verificationupdate/:yearId/:VRStatus')
  async UpdateVRStatusForMac(
    @Query('yearId') yearId: number,
    @Query('VRStatus') VRStatus: number,
  ) {
    return await this.service.updateVRStatusforMac(
      
      yearId,
      VRStatus
     
    );
  }

  @Override()
  async createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: AssessmentResault,
  ): Promise<AssessmentResault> {
    //console.log("came to inside...",dto);
   // console.log('req1----', dto);
  
    //console.log(asr);

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      let asr= await queryRunner.manager.save(AssessmentResault, dto);
      // let asr = await this.base.createOneBase(req, dto);
      var assement = await this.assesmentRepo.findOne(asr.assement.id);
      assement.macValue = asr.macResult;

      await queryRunner.manager.save(Assessment, assement);
      // this.assesmentRepo.save(assement);
      
      await queryRunner.commitTransaction();
      return asr;
    }
    catch (err) {
      console.log("worktran2")
      console.log(err);
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }


  @Get('trackpage/assessmentsResults/byAssessmentId/:id')
  async getAssessmentResultBYAssessmentId(
    @Request() request,
    @Query('id') id: number,
    
  ): Promise<any> {
    return await this.service.getAssessmentResultBYAssessmentId(
      id,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('dashboaremission')
  async getAssessmentResultforDashboard(
    @Request() request,
    @Query('assesYear') assesYear: number,
    
  ): Promise<any> {
    // console.log("work")
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let institutionIdFromTocken: number;
    let moduleLevelsFromTocken: number[];
    [countryIdFromTocken, sectorIdFromTocken, institutionIdFromTocken,moduleLevelsFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.InstitutionId,
        TokenReqestType.moduleLevels
      ]);
    return await this.service.getAssessmentResultforDashboard(
      assesYear,
      countryIdFromTocken,
      sectorIdFromTocken,
      moduleLevelsFromTocken
    );
  }

}
