import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { AssessmentYearService } from './assessment-year.service';
import { DataVerifierDto } from './Dto/dataVerifier.dto';
import { AssessmentYear } from './entity/assessment-year.entity';
import { getConnection } from 'typeorm';

import axios from "axios";
import { Email } from 'read-excel-file/types';

@Crud({
  model: {
    type: AssessmentYear,
  },
  query: {
    join: {
      assessment: {
        eager: true,
      },
      assessmentResault: {
        eager: true,
      },
      QuAlityCheckStatus: {
        eager: true,
      },
      VerificationStatus: {
        eager: true,
      },
      verificationDetail: {
        eager: true,
      },
    },
  },
})
@Controller('assessment-year')

export class AssessmentYearController
  implements CrudController<AssessmentYear>
{
  constructor(
    public service: AssessmentYearService,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails,
  ) { }

  get base(): CrudController<AssessmentYear> {
    return this;
  }

  @Get('getByProjectId/:projectId')
  async getAllByProjectId(
    @Request() request,
    @Query('projectId') projectId: number,
  ): Promise<any> {
    return await this.service.getAllYearsByProjectId(projectId);
  }

  @Get('getAssessmentByYearId/:yearId/:userName')
  async getAssessmentByYearId(
    @Request() request,
    @Query('yearId') yearId: number,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.service.getAssessmentByYearId(yearId, userName);
  }


  @Get("email")
  async email(@Query('yearId') yearId: number,) {
    console.log("yearId", yearId)
    this.service.mail(yearId);
  }



  @UseGuards(JwtAuthGuard)
  @Get('getDataForReport/:projIds/:assessTypes/:yearIds')
  async getDataForReport(
    @Request() request,
    @Query('projIds') projIds: string,
    @Query('assessTypes') assessTypes: string,
    @Query('yearIds') yearIds: string,
  ): Promise<any> {

    let audit: AuditDto = new AuditDto();
    audit.action = 'Report Generated';
    audit.comment = 'Report Generated';
    audit.actionStatus = 'Generated'
    this.auditService.create(audit);
    console.log('Generated Report');

    return await this.service.getDataForReport(projIds, assessTypes, yearIds);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getDataForReportNew/:projIds/:assessTypes/:yearIds/:macAssesmentType')
  async getDataForReportNew(
    @Request() request,
    @Query('projIds') projIds: string,
    @Query('assessTypes') assessTypes: string,
    @Query('yearIds') yearIds: string,
    @Query('MacAssesmentType') macAssesmentType: string,

  ): Promise<any> {

    let audit: AuditDto = new AuditDto();
    audit.action = 'Report Generated';
    audit.comment = 'Report Generated';
    audit.actionStatus = 'Generated'
    this.auditService.create(audit);
    console.log('Generated Report');

    return await this.service.getDataForReportNew(projIds, assessTypes, yearIds, macAssesmentType);
  }


  @UseGuards(JwtAuthGuard)
  @Get('getDataForParameterReportNew/:projIds/:assessTypes/:yearIds/:macAssesmentType')
  async getDataForParameterReportNew(
    @Request() request,
    @Query('projIds') projIds: string,
    @Query('assessTypes') assessTypes: string,
    @Query('yearIds') yearIds: string,
    @Query('MacAssesmentType') macAssesmentType: string,

  ): Promise<any> {

    let audit: AuditDto = new AuditDto();
    audit.action = 'Report Generated';
    audit.comment = 'Report Generated';
    audit.actionStatus = 'Generated'
    this.auditService.create(audit);
    console.log('Generated Report');

    return await this.service.getDataForParameterReportNew(projIds, assessTypes, yearIds, macAssesmentType);
  }


  @UseGuards(JwtAuthGuard)
  @Get('getAssessmentForAssignVerifiers')
  async getAssessmentForAssignVerifiers(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('statusId') statusId: number,
    @Query('filterText') filterText: string,
  ): Promise<any> {

    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;


    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId, TokenReqestType.sectorId, TokenReqestType.InstitutionId])



    return await this.service.getAssessmentForAssignVerifiers(
      {
        limit: limit,
        page: page,
      },
      filterText,
      statusId,
      countryIdFromTocken
    );
  }

  @Get('getAllByAssessmentId/:assessmentId')
  async getAllByAssessmentId(
    @Request() request,
    @Query('assessmentId') assessmentId: number,
  ): Promise<any> {
    console.log(assessmentId);
    return await this.service.getAllYearsByAssessmentId(assessmentId);
    //return [{ data: { id: 21 } }];
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-assign-verifiers')
  async updateAssignVerifiers(
    @Body() updateDeadlineDto: DataVerifierDto,
  ): Promise<boolean> {

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      let audit: AuditDto = new AuditDto();
      let paeameter = this.service.acceptDataVerifiersForIds(updateDeadlineDto);
      console.log(updateDeadlineDto)
      audit.action = 'Verifier Deadline Created';
      audit.comment = 'Verifier Deadline Created';
      audit.actionStatus = 'Created'
      this.auditService.create(audit);
      await queryRunner.commitTransaction();
      return paeameter;
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

  @UseGuards(JwtAuthGuard)
  @Put('accept-qc')
  async acceptQC(@Body() updateDeadlineDto: DataVerifierDto): Promise<boolean> {

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      let audit: AuditDto = new AuditDto();
      let paeameter = this.service.acceptQC(updateDeadlineDto);
      // console.log(updateDeadlineDto)
      audit.action = 'Quality Check Added';
      audit.comment = 'Quality Check Added';
      audit.actionStatus = 'Added'
      this.auditService.create(audit);
      await queryRunner.commitTransaction();
      return paeameter;
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

  @Get('assessmentYears/getVerification/:assessmentId/:assementYear')
  async getVerificationDeatilsByAssessmentIdAndAssessmentYear(
    @Request() request,
    @Query('assessmentId') assessmentId: number,
    @Query('assementYear') assementYear: string,
  ): Promise<any> {
    return await this.service.getVerificationDetails(
      assessmentId,
      assementYear,
    );
  }

  @Get(
    'assessmentYears/getapprovedata/:assessmentType/:assementYear/:climateActionName',
  )
  async getdetailsByAssessmentYearAndProjNameAndAsseType(
    @Request() request,
    @Query('assessmentType') assessmentType: string,
    @Query('assementYear') assementYear: string,
    @Query('climateActionName') climateActionName: string,
  ): Promise<any> {
    return await this.service.getdetailsByAssessmentYearAndProjNameAndAsseType(
      assessmentType,
      assementYear,
      climateActionName,
    );
  }



  @Get(
    'assessmentYears/getAssessmentByYearAndProjectId/:year/:projectId',
  )
  async getAssessmentByYearAndProjectId(
    @Request() request,
    @Query('year') year: string,
    @Query('projectId') projectId: number,

  ): Promise<any> {
    return await this.service.getAssessmentByYearAndProjectId(
      year,
      projectId,

    );
  }

  @Override()
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: AssessmentYear,
  ) {



    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      let updateData = await queryRunner.manager.save(AssessmentYear, dto);
      // let updateData = await this.base.updateOneBase(req, dto);
      let audit: AuditDto = new AuditDto();

      audit.action = updateData.assessment.assessmentType + ' Updated';
      audit.comment = updateData.assessment.assessmentType + ' Updated';
      audit.actionStatus = 'Updated'

      this.auditService.create(audit);
      await queryRunner.commitTransaction();
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



  @UseGuards(JwtAuthGuard)
  @Get("mac")
  async getAssessmentYearsForCountryAndSectorAdmins(@Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sectorId') sectorId: number,
    @Query('isPost') isPost: number
  ): Promise<any> {


    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;


    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId, TokenReqestType.sectorId, TokenReqestType.InstitutionId])



    console.log("countryIdFromTocken", countryIdFromTocken)
    let resault = await this.service.getAssessmentYearsForCountryAndSectorAdmins({
      limit: limit,
      page: page,
    },
      isPost,
      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken,

    );



    const assementYearWiseList = new Map();
    resault.items.forEach(assyesr => {
      const key = assyesr.assessmentYear;
      const collection = assementYearWiseList.get(key);
      if (!collection) {
        assementYearWiseList.set(key, [assyesr]);
      } else {
        collection.push(assyesr);
      }
    });

    // console.log('assementYearWiseList',resault );
    const graphsYearWise = [];
    const graphsData = new Map();
    assementYearWiseList.forEach(async function (value, key) {

      let projects: string[] = [];
      let ers: number[] = [];
      let macs: number[] = [];
      // console.log(key + " = " + value);
      for (let assYr of value) {

        //  console.log('prject',assYr.assessment.project.climateActionName);
        // console.log('assessment', assYr.assessment);
        //  console.log('macs',assYr.assessmentResault?assYr.assessmentResault.macResult?assYr.assessmentResault.macResult:0:0);
        if (!projects.includes(assYr.assessment.project.climateActionName) && assYr.assessment && assYr.assessment.emmisionReductionValue > 0 && assYr.assessment.macValue && (assYr.assessment.macValue > -1000 && assYr.assessment.macValue < 1000)) {
          projects.push(assYr.assessment.project.climateActionName);
          ers.push(assYr.assessment.emmisionReductionValue);
          macs.push(assYr.assessment.macValue);
        }



      }
      if (projects.length > 0) {
        graphsData.set(key, {
          projects: projects,
          ers: ers,
          macs: macs

        })


      }


      // console.log(projects);
      // console.log(ers);
      // console.log(macs);



    })
    console.log(typeof (graphsData))
     for await (let gr of graphsData) {
      // console.log('gr',gr[1])
      await axios.post('http://localhost:8000/image', gr[1]).then(res => {
        // console.log(res.data)
        graphsYearWise.push([gr[0], res.data])

        // console.log('graphsYearWise',graphsYearWise)
      }).catch(err => {
        // console.log(err)

      })

    }

    // console.log('resault',graphsYearWise)


    return graphsYearWise;
  }


  @UseGuards(JwtAuthGuard)
  @Get('trackCA/assessmentYearList')
  async getAssessmentYearsListInTrackCA(
    @Request() request,


  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId, TokenReqestType.sectorId])


    return await this.service.getAssessmentYearsListInTrackCA(
      countryIdFromTocken,
    );
  }


  @UseGuards(JwtAuthGuard)
  @Get('assessmentYearForManageDataStatus')
  async assessmentYearForManageDataStatus(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    // @Query('assessmentStatusName') assessmentStatusName: string,
    // @Query('Active') Active: number,
    // @Query('countryId') countryId: number,
    // @Query('sectorId') sectorId: number,
    @Query('isProposal') isProposal: number,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('getAll') getAll: string,
    @Query('approveStatus') approveStatus: string

  ): Promise<any> {

    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId, TokenReqestType.sectorId])


    return await this.service.assessmentYearForManageDataStatus(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,
      // assessmentStatusName,
      // Active,
      // countryId,
      // sectorId,
      isProposal,
      countryIdFromTocken,
      sectorIdFromTocken,
      climateActionId,
      year,
      getAll,
      approveStatus

    );
  }




}
