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
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController } from '@nestjsx/crud';
import { request, response } from 'express';
import { createReadStream,readFile } from 'fs';
import { AssesmentResaultService } from 'src/assesment-resault/assesment-resault.service';
import { AssessmentResault } from 'src/assesment-resault/entity/assessment-resault.entity';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { AssessmentYearService } from 'src/assessment-year/assessment-year.service';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Sector } from 'src/master-data/sector/sector.entity';
import { SectorService } from 'src/master-data/sector/sector.service';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { ParameterService } from 'src/parameter/parameter.service';
import { Project } from 'src/project/entity/project.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { Repository } from 'typeorm-next';
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
    public resaultService: AssesmentResaultService,
    private readonly tokenDetails: TokenDetails,
  ) { }

  get base(): CrudController<Report> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Get(
    // 'report/reportinfo/:page/:limit/:filterText/:countryId/:sectorId/:ndcId/:projectId/:assessmentType',
    'report/reportinfo/:page/:limit/:filterText/:sectorId',
  )
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
    // let sectorIdFromTocken: number;


    [countryIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId])



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
      countryIdFromTocken
    );
  }

  @Get('getAllPdfFiles')
  async getAllPdfFiles(): Promise<any> {
    const res = await this.service.getPdfReportFiles();
    return res;
  }


  @UseGuards(JwtAuthGuard)
  @Post(
    // 'report/reportinfo/:page/:limit/:filterText/:countryId/:sectorId/:ndcId/:projectId/:assessmentType',
    'reportPDF',
  )
  async getReportPDF(@Body() reportData: ReportDataPDF): Promise<any> {

    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;


    [countryIdFromTocken,sectorIdFromTocken]= this.tokenDetails.getDetails([TokenReqestType.countryId,TokenReqestType.sectorId])
    const res = await this.service.testPDF(reportData,countryIdFromTocken,sectorIdFromTocken);
    return { fileName: res };
  }


  @Post('reportPdfFileData')
  async getReportPdfFileData(@Body() dto: ReportPdfInsert): Promise<any> {
    const res = await this.service.savePdfFileData(dto);
    // console.log("====== res ++++++",res);

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
    // let sectorIdFromTocken: number;


    [countryIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId])

    let restult = await this.service.getPdfFileData(
      ndc,
      climateAction,
      sector,
      reportName,
      countryIdFromTocken
    );


    return restult;
  }


  @Get('parameterData/:assesId/:assesYear')
  async getParameterData(
    @Query('assesId') assesId: string,
    @Query('assesYear') assesYear: string,
  ): Promise<any> {
    let restult = await this.service.getParameterData(
      assesId,
      assesYear,
    );
    return restult;
  }


  @Get('chartData/:years/:projIds/:assessType/:chartName')
  async getChartDownlordData(
    @Res({ passthrough: true }) res,
    @Query('years') years: number[],
    @Query('projIds') projIds: string[],
    @Query('assessType') assessType: string[],
  ): Promise<any> {
    let imageName = await this.service.generateChartForDownlord(
      years,
      projIds,
      assessType,
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
      'Content-Disposition': `attachment; filename= emmision_reduction.png`
    })
  

    const file = createReadStream('./public/'+img);
    return new StreamableFile(file);

  }

  // @Post('newReportInfo')
  // async getNewReportInfor(
  //     @Body() getReportDto: GetReportDto,
  //     @Res() response: any,
  // ): Promise<any>{

  //     var finalReport = new ReportResponseDto();
  //     let assesment = new Assessment();
  //     let project = new Project();
  //     let parameter: Parameter[] = [];
  //     let assemenntIdList: number[] = new Array();
  //     let yr: AssessmentYear[] = [];
  //     let resault: AssessmentResault[] = [];

  //     console.log('new project infor API request==================',getReportDto.project[0].climateActionName)

  //    try{

  //     for(var a=0; a<getReportDto.project.length;a++){

  //         //all projects, sectors and ndc based on selection
  //         project = getReportDto.project[a];
  //         finalReport.project.push(project);
  //         finalReport.sector.push(project.sector);
  //         finalReport.ndc.push(project.ndc);

  //         for(var b=0;b<getReportDto.project[a].assessments.length;b++){
  //             assesment = getReportDto.project[a].assessments[b];

  //             //get assessments based on selected assessment type
  //             if(getReportDto.assessmentTypeList.includes(assesment.assessmentType)){
  //                 finalReport.assessment.push(assesment);
  //                 assemenntIdList.push(assesment.id);
  //             }
  //         }

  //         // selected yrs by user

  //         for(var a=0; a<assemenntIdList.length; a++){

  //             //all yrs for selected assessments
  //             yr = await this.yrService.getYearListByAssessmentId(assemenntIdList[a]);
  //             // console.log('all yrs for selected assessments',yr);
  //         }
  //         for(const a of yr){
  //             if(getReportDto.assessmentYrList.includes(a.assessmentYear)){
  //                 // console.log('trueeeeeeee');
  //                 finalReport.assessmentYr.push(a);
  //             }
  //         }
  //     }
  //     for(var a=0; a<assemenntIdList.length; a++){
  //         //get parameters for selected assessments
  //         parameter = (await this.paraService.getParameterByAssesment(assemenntIdList[a]));
  //         for(const a of parameter){
  //             finalReport.assessmentParamater.push(a);
  //         }
  //     }
  //     console.log('new assessment infor final object -------------------',finalReport.assessment[0].baselineScenario);
  //     return finalReport;
  //     // console.log('new assessment infor final object 11111111111111111111111',finalReport.assessment[0].baselineScenario)

  //    } catch(error){
  //        console.log('catch errororoooo',error)
  //    }

  // }

  ///......................START..........................///

  @Post('newReportInfo')
  async getFinalReportDetails(
    @Body() getReportDto: GetReportDto,
  ): Promise<any> {
    var finalReport = new ReportResponseDto();
    let assesment = new Assessment();
    let project = new Project();
    let parameter: Parameter[] = [];
    let assemenntIdList: number[] = new Array();
    let yr: AssessmentYear[] = [];
    let res: AssessmentResault[] = [];
    let resault: AssessmentResault[] = [];

    // console.log('new project infor API request==================',getReportDto.project[0].climateActionName)

    try {
      for (var a = 0; a < getReportDto.project.length; a++) {
        //all projects, sectors and ndc based on selection
        project = getReportDto.project[a];
        finalReport.project.push(project);
        finalReport.sector.push(project.sector);
        finalReport.ndc.push(project.ndc);

        for (var b = 0; b < getReportDto.project[a].assessments.length; b++) {
          assesment = getReportDto.project[a].assessments[b];

          //get assessments based on selected assessment type
          if (
            getReportDto.assessmentTypeList.includes(assesment.assessmentType)
          ) {
            finalReport.assessment.push(assesment);
            assemenntIdList.push(assesment.id);
          }
        }

        // selected yrs by user

        for (var a = 0; a < assemenntIdList.length; a++) {
          //all yrs for selected assessments
          yr = await this.yrService.getYearListByAssessmentId(
            assemenntIdList[a],
          );
          // console.log('all yrs for selected assessments',yr);
        }
        for (const a of yr) {
          if (getReportDto.assessmentYrList.includes(a.assessmentYear)) {
            // console.log('trueeeeeeee');
            finalReport.assessmentYr.push(a);
          }
        }
      }
      for (var a = 0; a < assemenntIdList.length; a++) {
        //get parameters for selected assessments
        // console.log('id list........',assemenntIdList)
        parameter = await this.paraService.getParameterByAssesment(
          assemenntIdList[a],
        );
        for (const a of parameter) {
          finalReport.assessmentParamater.push(a);
        }
      }

      for (const a of assemenntIdList) {
        // console.log('resault==========',a, b.id, await this.resaultService.GetAssesmentResult(a,b.id,false));
        for (const b of finalReport.assessmentYr)
          res.push(
            await this.resaultService.GetAssesmentResult(a, b.id, false),
          );
        // console.log('resault.......==========',res);
        // finalReport.resault.push(await this.resaultService.GetAssesmentResult(a,b,false))
      }
      for (const r of res) {
        finalReport.resault.push(r);
      }

      finalReport.reportName = getReportDto.reportName;

      return finalReport;
    } catch (error) {
      console.log('catch errororoooo', error);
    }
  }

  ///......................END..........................///
}
