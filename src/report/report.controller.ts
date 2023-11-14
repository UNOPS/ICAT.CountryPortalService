import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { createReadStream } from 'fs';
import { AssessmentResultService } from 'src/assessment-result/assessment-result.service';
import { AssessmentResult } from 'src/assessment-result/entity/assessment-result.entity';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { AssessmentYearService } from 'src/assessment-year/assessment-year.service';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { ParameterService } from 'src/parameter/parameter.service';
import { Project } from 'src/project/entity/project.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { GetReportDto } from './dto/get-report.dto';
import { ReportResponseDto } from './dto/report-response.dto';
import { ReportDataPDF } from './dto/reportDataPDF.dto';
import { ReportPdfInsert } from './dto/reportPdfInsert.dto';
import { Report } from './entity/report.entity';
import { ReportService } from './report.service';

@Crud({
  model: {
    type: Report,
  },
  query: {
    join: {
      country: {
        eager: true,
      },
      sector: {
        eager: true,
      },
      ndc: {
        eager: true,
      },
      climateaction: {
        eager: true,
      },
    },
  },
})
@Controller('report')
export class ReportController implements CrudController<Report> {
  constructor(
    public service: ReportService,
    public paraService: ParameterService,
    public yrService: AssessmentYearService,
    public resultService: AssessmentResultService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  get base(): CrudController<Report> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Get('report/reportinfo/:page/:limit/:filterText/:sectorId')
  async getReportInfo(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('countryId') countryId: number,
    @Query('sectorId') sectorId: number,
    @Query('ndcId') ndcId: number,
    @Query('projectId') projectId: number,
    @Query('assessmentType') assessmentType: string,
  ): Promise<any> {
    let countryIdFromTocken: number;

    [countryIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
    ]);

    return await this.service.getReportDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      countryId,
      sectorId,
      ndcId,
      projectId,
      assessmentType,
      countryIdFromTocken,
    );
  }

  @Get('getAllPdfFiles')
  async getAllPdfFiles(): Promise<any> {
    const res = await this.service.getPdfReportFiles();
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('reportPDF')
  async getReportPDF(@Body() reportData: ReportDataPDF): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);
    const res = await this.service.testPDF(
      reportData,
      countryIdFromTocken,
      sectorIdFromTocken,
    );

 
    return { fileName: res };
  }

  @Get('reportnormalPDF')
  async getReportnormalPDF(): Promise<any> {
  

    const res = await this.service.createnormalpdf(
    
    );
    return { fileName: res };
  }

  @Post('reportPdfFileData')
  async getReportPdfFileData(@Body() dto: ReportPdfInsert): Promise<any> {
    const res = await this.service.savePdfFileData(dto);

    return res;
  }
  @UseGuards(JwtAuthGuard)
  @Get('reportPdfFileData/:Ndc/:ClimateAction/:Sector/:ReportName')
  async getPdfDataAndFilter(
    @Query('ndc') ndc: string,
    @Query('climateAction') climateAction: string,
    @Query('sector') sector: string,
    @Query('reportName') reportName: string,
  ) {
    let countryIdFromTocken: number;

    [countryIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
    ]);

    const restult = await this.service.getPdfFileData(
      ndc,
      climateAction,
      sector,
      reportName,
      countryIdFromTocken,
    );

    return restult;
  }

  @Get('parameterData/:assesId/:assesYear')
  async getParameterData(
    @Query('assesId') assesId: string,
    @Query('assesYear') assesYear: string,
  ): Promise<any> {
    const restult = await this.service.getParameterData(assesId, assesYear);
    return restult;
  }

  @UseGuards(JwtAuthGuard)
  @Get('chartData/:years/:projIds/:assessType/:chartName')
  async getChartDownlordData(
    @Res({ passthrough: true }) res,

    @Query('projIds') projIds: string[],
    @Query('assessType') assessType: string[],

    @Query('yearsId') yearsId: number[],
    @Query('selectAllSectors') selectAllSectors: boolean,
    @Query('sectorIds') sectorIds: number[],
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    const imageName = await this.service.generateChartForDownlord(
      projIds,
      assessType,
      selectAllSectors,
      sectorIds,
      yearsId,
      countryIdFromTocken,
      sectorIdFromTocken,
    );

    return `{"name":"${imageName}"}`;
  }

  @Get('chartDataImage/:img')
  async getChartDownlordDataImage(
    @Res({ passthrough: true }) res,

    @Param('img') img: string,
  ): Promise<any> {
    res.set({
      'Content-Type': `image/png`,
      'Content-Disposition': `attachment; filename= emmision_reduction.png`,
    });

    const file = createReadStream('./public/' + img);
    return new StreamableFile(file);
  }

  @Post('newReportInfo')
  async getFinalReportDetails(
    @Body() getReportDto: GetReportDto,
  ): Promise<any> {
    const finalReport = new ReportResponseDto();
    let assessment = new Assessment();
    let project = new Project();
    let parameter: Parameter[] = [];
    const assemenntIdList: number[] = [];
    let yr: AssessmentYear[] = [];
    const res: AssessmentResult[] = [];

    try {
      for (let a = 0; a < getReportDto.project.length; a++) {
        project = getReportDto.project[a];
        finalReport.project.push(project);
        finalReport.sector.push(project.sector);
        finalReport.ndc.push(project.ndc);

        for (let b = 0; b < getReportDto.project[a].assessments.length; b++) {
          assessment = getReportDto.project[a].assessments[b];

          if (
            getReportDto.assessmentTypeList.includes(assessment.assessmentType)
          ) {
            finalReport.assessment.push(assessment);
            assemenntIdList.push(assessment.id);
          }
        }

        for (let a = 0; a < assemenntIdList.length; a++) {
          yr = await this.yrService.getYearListByAssessmentId(
            assemenntIdList[a],
          );
        }
        for (const a of yr) {
          if (getReportDto.assessmentYrList.includes(a.assessmentYear)) {
            finalReport.assessmentYr.push(a);
          }
        }
      }
      for (let a = 0; a < assemenntIdList.length; a++) {
        parameter = await this.paraService.getParameterByAssessment(
          assemenntIdList[a],
        );
        for (const a of parameter) {
          finalReport.assessmentParamater.push(a);
        }
      }

      for (const a of assemenntIdList) {
        for (const b of finalReport.assessmentYr)
          res.push(
            await this.resultService.GetAssessmentResult(a, b.id, false),
          );
      }
      for (const r of res) {
        finalReport.result.push(r);
      }

      finalReport.reportName = getReportDto.reportName;

      return finalReport;
    } catch (error) {}
  }
}
