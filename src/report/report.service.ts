import { EmissionReductioDraftDataEntity } from './../master-data/emisssion-reduction-draft-data/entity/emission-reductio-draft-data.entity';
import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { AssessmentYearService } from 'src/assessment-year/assessment-year.service';
import { Country } from 'src/country/entity/country.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { Project } from 'src/project/entity/project.entity';
import { ReportDataPDF } from './dto/reportDataPDF.dto';
import { ReportAssessment } from './entity/report-assessment.entity';
import { ReportNdc } from './entity/report-ndc.entity';
import { ReportProject } from './entity/report-project.entity';
import { ReportSector } from './entity/report-sector.entity';
import { Report } from './entity/report.entity';
import { Like, Repository } from 'typeorm';
import { ProjectService } from 'src/project/project.service';
import { AssessmentResult } from 'src/assessment-result/entity/assessment-result.entity';
import axios from 'axios';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { ProjectOwner } from 'src/master-data/project-owner/projeect-owner.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { AssessmentService } from 'src/assessment/assessment.service';
const path = require('path');
import { readdir } from 'fs/promises';
import { ReportPdfInsert } from './dto/reportPdfInsert.dto';
import { ReportPdfFileData } from './entity/report-pdfFile.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { ProjectionResult } from 'src/projection-result/entity/projection-result.entity';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { UsersService } from 'src/users/users.service';
import { DefaultValueService } from 'src/default-value/default-value.service';
import { EmissionReductionDraftdataService } from 'src/master-data/emisssion-reduction-draft-data/emission-reduction-draftdata.service';
import { VerifierAcceptance } from 'src/parameter/enum/verifier-acceptance.enum';
import * as puppeteer from 'puppeteer';
import { promises as fsPromises } from 'fs';
import { StorageService } from 'src/storage/storage.service';
@Injectable()
export class ReportService extends TypeOrmCrudService<Report> {
  projectionDataResults: any;
  constructor(
    @InjectRepository(Report) repo,
    private readonly usersService: UsersService,
    private readonly assessmentYearService: AssessmentYearService,
    private readonly assessmentService: AssessmentService,
    private readonly projectService: ProjectService,
    private readonly defaultValueService: DefaultValueService,
    private readonly emissionReductionDraftDataService: EmissionReductionDraftdataService,
    private readonly tokenDetails: TokenDetails,
    @InjectRepository(EmissionReductioDraftDataEntity)
    private readonly graphRepository: Repository<EmissionReductioDraftDataEntity>,
    @InjectRepository(Project) private readonly proRepo: Repository<Project>,
    @InjectRepository(Assessment)
    private readonly assessment: Repository<Assessment>,
    @InjectRepository(AssessmentYear)
    private readonly assessmentYearResults: Repository<AssessmentYear>,
    @InjectRepository(ReportPdfFileData)
    private readonly reportPdfFileData: Repository<ReportPdfFileData>,
    @InjectRepository(Ndc) private readonly ndc: Repository<Ndc>,
    @InjectRepository(Parameter)
    private readonly parameter: Repository<Parameter>,
    @InjectRepository(ProjectOwner)
    private readonly projectOwner: Repository<ProjectOwner>,
    @InjectRepository(AssessmentResult)
    private readonly assResRepo: Repository<AssessmentResult>,
    private storageService: StorageService
  ) {
    super(repo);
  }

  public ndcItemList: any;
  public ndcItemListActivity: any;
  public asesmentYears: any;
  public assessmentMetholodgy: any;
  public assessmentParameter: any;
  public assessmentResult: any;
  public commenAssestment: any;
  public commenAssestmentActivity: any;
  public assestmentYerResult: any;
  public temporalBoundaryear: any;
  public unquieYears: any;
  public baseLineResultConcat: any;
  public projectResultConcat: any;
  public isCheckLekage: any;

  public assessmentBaseLineResultYears: any[] = [];
  public assessmentBaseLineResult: any[] = [];

  public assessmentProjectResultYears: any[] = [];
  public assessmentProjectResult: any[] = [];

  public projectionBaseLineResultYears: any[] = [];
  public projectionBaseLineResult: any[] = [];

  public projectionProjectResultYears: any[] = [];
  public projectionProjectResult: any[] = [];

  public projectionBaseResul: any[] = [];
  public assessmentProjectResultWithYears: any[] = [];

  async getReportDetails(
    options: IPaginationOptions,
    filterText: string,
    countryId: number,
    sectorId: number,
    ndcId: number,
    projectId: number,
    assessmentType: string,
    countryIdFromTocken: number,
  ): Promise<Pagination<Report>> {
    let filter = '';
    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and rep.countryId = :countryIdFromTocken`;
      } else {
        filter = `rep.countryId = :countryIdFromTocken`;
      }
    }

    if (filterText != null && filterText != undefined && filterText != '') {
      filter = '(rep.reportName LIKE :filterText)';
    }

    if (
      assessmentType != null &&
      assessmentType != undefined &&
      assessmentType != ''
    ) {
      if (filter) {
        filter = `${filter} and asse.assessmentType = :assessmentType`;
      } else {
        filter = `asse.assessmentType = :assessmentType`;
      }
    }

    if (countryId != 0) {
      if (filter) {
        filter = `${filter} and con.id = :countryId`;
      } else {
        filter = `con.id = :countryId`;
      }
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter} and sec.id = :sectorId`;
      } else {
        filter = `sec.id = :sectorId`;
      }
    }

    if (ndcId != 0) {
      if (filter) {
        filter = `${filter} and ndc.id = :ndcId`;
      } else {
        filter = `ndc.id = :ndcId`;
      }
    }

    if (projectId != 0) {
      if (filter) {
        filter = `${filter} and ca.id = :projectId`;
      } else {
        filter = `ca.id = :projectId`;
      }
    }

    const data = this.repo
      .createQueryBuilder('rep')

      .leftJoinAndMapOne(
        'rep.country',
        Country,
        'con',
        'con.Id = rep.countryId',
      )

      .leftJoinAndMapMany(
        'rep.reportAsse',
        ReportAssessment,
        'rasse',
        'rasse.Id = rep.Id',
      )
      .leftJoinAndMapMany(
        'rep.assessment',
        Assessment,
        'asse',
        'rasse.assessmentId = asse.Id',
      )

      .leftJoinAndMapMany(
        'rep.reportNdc',
        ReportNdc,
        'rndc',
        'rndc.Id = rep.Id',
      )
      .leftJoinAndMapMany('rep.ndc', Ndc, 'ndc', 'rndc.ndcId = ndc.Id')

      .leftJoinAndMapMany(
        'rep.reportProject',
        ReportProject,
        'rca',
        'rca.Id = rep.Id',
      )
      .leftJoinAndMapMany('rep.project', Project, 'ca', 'rca.projectId = ca.Id')

      .leftJoinAndMapMany(
        'rep.reportSector',
        ReportSector,
        'rsec',
        'rsec.Id = rep.Id',
      )
      .leftJoinAndMapMany('rep.sector', Sector, 'sec', 'rsec.sectorId = sec.Id')

      .where(filter, {
        filterText: `%${filterText}%`,
        countryIdFromTocken,
        sectorId,
        ndcId,
        projectId,
        assessmentType,
      })
      .orderBy('rep.createdOn', 'DESC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getPdfReportFiles() {
    try {
      const files = await readdir('./public');

      const pdfFiles = [];
      for (const file of files) {
        if (path.extname(file) === '.pdf') {
          pdfFiles.push(file);
        }
      }

      return pdfFiles;
    } catch (err) {}
  }
 
  async generateChart(summryReport: any[], graphData: any): Promise<string> {
    const BAUList: number[] = [];
    const ConditionalList: number[] = [];
    const UnConditionalList: number[] = [];
    const ActualList: number[] = [];
    const currentYear: number = new Date().getFullYear();

    const ChartJSImage = require('chart.js-image');

    const yrList: number[] = [];
    for (
      let year = parseInt(graphData.baseYear);
      year <= parseInt(graphData.targetYear);
      year++
    ) {
      yrList.push(year);
    }
    const unconditionalValue =
      graphData.targetYearEmission - graphData.unconditionaltco2;

    const conditionalValue =
      graphData.targetYearEmission - graphData.conditionaltco2;

    const yrGap = parseInt(graphData.targetYear) - parseInt(graphData.baseYear);
    const baseYear = parseInt(graphData.baseYear);

    for (const year of yrList) {
      const bauValue: number =
        ((graphData.targetYearEmission - graphData.baseYearEmission) / yrGap) *
          (year - baseYear) +
        graphData.baseYearEmission;
      ConditionalList.push(
        graphData.conditionaltco2 && graphData.conditionaltco2 != 0
          ? ((conditionalValue - graphData.baseYearEmission) / yrGap) *
              (year - baseYear) +
              graphData.baseYearEmission
          : 0,
      );
      UnConditionalList.push(
        graphData.unconditionaltco2 && graphData.unconditionaltco2 != 0
          ? ((unconditionalValue - graphData.baseYearEmission) / yrGap) *
              (year - baseYear) +
              graphData.baseYearEmission
          : 0,
      );
      BAUList.push(bauValue);

      let total = 0;

      for (const sum of summryReport) {
        if (sum.Type == 'Ex-post' && Number(sum.Year) == year) {
          total = total + Number(sum.Result);
        }
      }
      if (year <= currentYear) {
        ActualList.push(bauValue - total / 1000000);
      }
    }

    const line_chart = ChartJSImage()
      .chart({
        type: 'line',
        data: {
          labels: yrList,

          datasets: [
            {
              label: 'Actual',
              tension: 0.5,
              borderColor: 'rgb(255,+205,+86)',
              backgroundColor: 'rgba(255,+205,+86,+.5)',
              data: ActualList,
            },
            {
              label: 'BAU',
              tension: 0.5,
              borderColor: 'rgb(255,+99,+132)',
              backgroundColor: 'rgba(255,+99,+132,+.5)',
              data: BAUList,
            },
            {
              label: 'NDC-Conditional',
              tension: 0.5,
              borderColor: 'rgb(54,+162,+235)',
              backgroundColor: 'rgba(54,+162,+235,+.5)',
              data: ConditionalList,
            },
            {
              label: 'NDC-Unconditional',
              tension: 0.5,
              borderColor: 'rgb(75,+192,+192)',
              backgroundColor: 'rgba(75,+192,+192,+.5)',
              data: UnConditionalList,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Emission Reduction Targets',
          },
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Year',
                },
              },
            ],
            yAxes: [
              {
                stacked: false,
                scaleLabel: {
                  display: true,
                  labelString: 'Emission(MtCO₂e)',
                },
              },
            ],
          },
        },
      })
      .backgroundColor('white')
      .width(500)
      .height(300);

    const datetime: string = new Date().getTime().toString();
    line_chart.toFile(`./public/reportPDF_${datetime}.png`);
    return datetime;
  }

  async generateChartForDownlord(
    projIds: string[],
    assessType: string[],
    selectAllSectors: boolean,
    sectorIds: number[],
    yearIds: number[],
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ) {
    const summryReport: any[] =
      await this.assessmentYearService.getDataForReportNew(
        Array.isArray(projIds) ? projIds.join(',') : projIds,
        Array.isArray(assessType) ? assessType.join(',') : assessType,
        Array.isArray(yearIds) ? yearIds.join(',') : "" + yearIds,
        '',
      );

    let setSectorId: number = sectorIds[0];
    if (selectAllSectors == true) {
      setSectorId = 0;
    }
    const graphData =
      await this.emissionReductionDraftDataService.getEmissionReductionDraftDataForReport(
        setSectorId,
        countryIdFromTocken,
        sectorIdFromTocken,
      );
    const BAUList: number[] = [];
    const ConditionalList: number[] = [];
    const UnConditionalList: number[] = [];
    const ActualList: number[] = [];

    const currentYear: number = new Date().getFullYear();

    const ChartJSImage = require('chart.js-image');

    const yrList: number[] = [];
    for (
      let year = parseInt(graphData.baseYear);
      year <= parseInt(graphData.targetYear);
      year++
    ) {
      yrList.push(year);
    }
    const unconditionalValue =
      graphData.targetYearEmission - graphData.unconditionaltco2;

    const conditionalValue =
      graphData.targetYearEmission - graphData.conditionaltco2;

    const yrGap = parseInt(graphData.targetYear) - parseInt(graphData.baseYear);
    const baseYear = parseInt(graphData.baseYear);

    for (const year of yrList) {
      const bauValue: number =
        ((graphData.targetYearEmission - graphData.baseYearEmission) / yrGap) *
          (year - baseYear) +
        graphData.baseYearEmission;
      ConditionalList.push(
        graphData.conditionaltco2 && graphData.conditionaltco2 != 0
          ? ((conditionalValue - graphData.baseYearEmission) / yrGap) *
              (year - baseYear) +
              graphData.baseYearEmission
          : 0,
      );
      UnConditionalList.push(
        graphData.unconditionaltco2 && graphData.unconditionaltco2 != 0
          ? ((unconditionalValue - graphData.baseYearEmission) / yrGap) *
              (year - baseYear) +
              graphData.baseYearEmission
          : 0,
      );
      BAUList.push(bauValue);

      let total = 0;

      for (const sum of summryReport) {
        if (sum.Type == 'Ex-post' && Number(sum.Year) == year) {
          total = total + Number(sum.Result);
        }
      }
      if (year <= currentYear) {
        ActualList.push(bauValue - total / 1000000);
      }
    }

    const line_chart = ChartJSImage()
      .chart({
        type: 'line',
        data: {
          labels: yrList,

          datasets: [
            {
              label: 'Actual',
              tension: 0.5,
              borderColor: 'rgb(255,+205,+86)',
              backgroundColor: 'rgba(255,+205,+86,+.5)',
              data: ActualList,
            },
            {
              label: 'BAU',
              tension: 0.5,
              borderColor: 'rgb(255,+99,+132)',
              backgroundColor: 'rgba(255,+99,+132,+.5)',
              data: BAUList,
            },
            {
              label: 'NDC-Conditional',
              tension: 0.5,
              borderColor: 'rgb(54,+162,+235)',
              backgroundColor: 'rgba(54,+162,+235,+.5)',
              data: ConditionalList,
            },
            {
              label: 'NDC-Unconditional',
              tension: 0.5,
              borderColor: 'rgb(75,+192,+192)',
              backgroundColor: 'rgba(75,+192,+192,+.5)',
              data: UnConditionalList,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Emission Reduction Targets',
          },
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Year',
                },
              },
            ],
            yAxes: [
              {
                stacked: false,
                scaleLabel: {
                  display: true,
                  labelString: 'Emission(MtCO₂e)',
                },
              },
            ],
          },
        },
      })
      .backgroundColor('white')
      .width(500)
      .height(300);

    const datetime: string = new Date().getTime().toString();
    await line_chart.toFile(`./public/chart_${datetime}.png`);
    return `chart_${datetime}.png`;
  }

  async generateProjectionEmmisionGrpah(id: number, projectId: number) {
    const assesementDataResults = await this.assessment
      .createQueryBuilder('assessment')
      .innerJoinAndSelect('assessment.assessmentYear', 'assessmentYear')
      .innerJoinAndSelect('assessment.assessmentResult', 'assessmentResult')
      .select(
        'assessment.projectId, assessmentYear.assessmentYear, assessmentResult.baselineResult as baseLineTot, assessmentResult.projectResult as projectTot',
      )
      .where('assessment.id = :id', { id: id })
      .orderBy('assessmentYear.assessmentYear')
      .execute();

    this.projectionDataResults = await this.assessment
      .createQueryBuilder('assessment')
      .innerJoinAndSelect('assessment.projectionResult', 'projectionResult')
      .select(
        'projectionResult.projectionYear, projectionResult.baselineResult as projectionBasetot, projectionResult.projectResult as projectionProjecttot, projectionResult.leakageResult as projectionLekagetot,projectionResult.emissionReduction as emissionReduction, projectionResult.id ',
      )
      .where('assessment.id = :id', { id: id })
      .orderBy('projectionResult.projectionYear')
      .execute();

    const year = [];
    const baseLineRes = [];
    const projectionRes = [];
    for (const assessment of assesementDataResults) {
      year.push(assessment.assessmentYear);
      baseLineRes.push(
        assessment.baseLineTot ? parseInt(assessment.baseLineTot) : 0,
      );
      projectionRes.push(
        assessment.projectTot ? parseInt(assessment.projectTot) : 0,
      );
    }

    for (const projection of this.projectionDataResults) {
      year.push(projection.projectionYear);
      baseLineRes.push(
        projection.projectionBasetot ? projection.projectionBasetot : 0,
      );
      projectionRes.push(
        projection.projectionProjecttot ? projection.projectionProjecttot : 0,
      );
    }



  const browser = await puppeteer.launch({
    executablePath:'/usr/bin/chromium-browser',
      args: ['--no-sandbox']
  });
    const page = await browser.newPage();

    // Inject Chart.js and data into the page
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <canvas style="width:500px;height:300px" id="myChart"></canvas>
        <script>
          var ctx = document.getElementById('myChart').getContext('2d');
          var chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ${JSON.stringify(year)},
              datasets: [   {
                label: 'BAU Scenario Emissions(tCO₂)',
                borderColor: 'rgb(54,+162,+235)',
                backgroundColor: 'rgba(54,+162,+235,+.5)',
                data: ${JSON.stringify(baseLineRes)},
              },
              {
                label: 'Project Scenario Emissions(tCO₂)',
                borderColor: 'rgb(255,+99,+132)',
                backgroundColor: 'rgba(255,+99,+132,+.5)',
                data:${JSON.stringify(projectionRes)} ,
              },
            ],
            },
            options: {
              title: {
                display: true,
                text: 'Project Emmisions Of BAU and Project Scenarios(tCO₂)',
              },
              animation: false,
              scales: {
                xAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: 'Years',
                    },
                  },
                ],
                yAxes: [
                  {
                    stacked: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'tCO₂',
                    },
                  },
                ],
              },
            },
          });
        </script>
      </body>
      </html>
    `);

    // Take a screenshot and save it as PNG
    await page.screenshot({ path: './public/graph' + id.toString() + '.png', type: 'png' });

    await browser.close(); 

  }

  async genarateMacGraph(
    assessmentYears: number[],
    assessmentType: string[],
    prjectIds: string[],
    isPost: number,
  ): Promise<string> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
      TokenReqestType.InstitutionId,
    ]);

    assessmentType = assessmentType
      .filter(function (item, pos) {
        return assessmentType.indexOf(item) == pos;
      })
      .map((a) => a.replace(/'/g, ''));

    const result =
      await this.assessmentYearService.getAssessmentYearsWiseMacGraphDataToSummeryReport(
        {
          limit: 0,
          page: 0,
        },
        isPost,
        0,
        countryIdFromTocken,
        sectorIdFromTocken,
        assessmentYears,
        assessmentType,
        prjectIds,
      );

    const assessmentYearWiseList = new Map();
    result.items.forEach((assyesr: { assessmentYear: any }) => {
      const key = assyesr.assessmentYear;
      const collection = assessmentYearWiseList.get(key);
      if (!collection) {
        assessmentYearWiseList.set(key, [assyesr]);
      } else {
        collection.push(assyesr);
      }
    });

    const graphsYearWise = [];
    const graphsData = new Map();
    assessmentYearWiseList.forEach(async function (value, key) {
      const projects: string[] = [];
      const ers: number[] = [];
      const macs: number[] = [];

      for (const assYr of value) {
        if (
          !projects.includes(assYr.assessment.project.climateActionName) &&
          assYr.assessment &&
          assYr.assessment.emmisionReductionValue > 0 &&
          assYr.assessment.macValue
        ) {
          projects.push(assYr.assessment.project.climateActionName);
          ers.push(assYr.assessment.emmisionReductionValue);
          macs.push(assYr.assessment.macValue);
        }
      }
      if (projects.length > 0) {
        graphsData.set(key, {
          projects: projects,
          ers: ers,
          macs: macs,
        });
      }
    });

    for (const gr of graphsData) {
      await axios
        .post(`${process.env.BASE_URL}/image`, gr[1])
        .then((res) => {
          graphsYearWise.push([gr[0], res.data]);
        })
        .catch((err) => {});
    }
    let macHtml = '';
    graphsYearWise.map((tr) => {
      macHtml = `${macHtml} 
      <div class="container" style="display:inline-block">
         
            <h2 style=" margin-left:35%;margin-top:50px">Mac Curve Year ${tr[0]}</h2>
            
           <img src="data:image/jpg;base64,${tr[1]}"  width="100%" />
           
      </div>`;
    });

    return macHtml;
  }

  async getParameterData(assesId: string, assesYear: string): Promise<any> {
    const res = await this.parameter
      .createQueryBuilder('para')
      .innerJoinAndSelect('para.assessment', 'asses')
      .where('para.AssessmentYear = :AssessmentYear', {
        AssessmentYear: assesYear,
      })
      .andWhere('asses.id = :id', { id: assesId })
      .orderBy('para.isBaseline', 'DESC')
      .getMany();

    return res;
  }

  async savePdfFileData(pdfData: ReportPdfInsert): Promise<any> {
    const response = await this.reportPdfFileData.insert(pdfData);

    return response;
  }

  async getPdfFileData(
    ndcName: string,
    climateAction: string,
    sectorName: string,
    reportName: string,
    countryIdFromTocken: number,
  ) {
    let res = [];
    if (!ndcName && !climateAction && !sectorName && !reportName) {
      res = await this.reportPdfFileData.find({
        where: {
          countryId: countryIdFromTocken,
        },
      });
    } else {
      res = await this.reportPdfFileData.find({
        where: {
          ndcName: Like(`%${ndcName}%`),
          climateAction: Like(`%${climateAction}%`),
          sectorName: Like(`%${sectorName}%`),
          reportName: Like(`%${reportName}%`),
          countryId: countryIdFromTocken,
        },
      });
    }

    return res;
  }

  async testPDF(
    reportData: ReportDataPDF,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<string> {
   
    let grpsfigurnumber=2;
    let activitiData = '';
    activitiData =
      activitiData +
      `
                <div>
                  <h2 style="font-weight: 700;color: #15246e;font-family: Calibri, san-serif;font-size: 32px;">Activity data</h2>
                </div>
              `;

    for (let i = 0; i < reportData.ndcIdList.length; i++) {
      this.ndcItemListActivity = reportData.ndcIdList[i];
      const ndcItem = await this.ndc.findOne({
        where: {
          id: reportData.ndcIdList[i],
        },
      });
      for (let i = 0; i < reportData.projIds.length; i++) {
        const climateDataActivity = await this.proRepo
          .createQueryBuilder('climate')
          .innerJoinAndSelect('climate.ndc', 'ndc')
          .innerJoinAndSelect('climate.assessments', 'assessments')
          .innerJoinAndSelect('assessments.assessmentYear', 'assessmentYear')
          .innerJoinAndSelect('climate.projectOwner', 'projectOwner')
          .innerJoinAndSelect('climate.projectStatus', 'projectStatus')
          .where('climate.id = :id', { id: reportData.projIds[i] })
          .andWhere('climate.ndcId = :ndcId', {
            ndcId: this.ndcItemListActivity,
          })
          .andWhere('assessmentYear.verificationStatus = 7')
          .getOne();

        if (climateDataActivity && climateDataActivity.assessments.length > 0) {
          const elementActive = climateDataActivity;

          activitiData =
            activitiData +
            `
                <div>
                  <p style="font-weight: 700;font-family: Calibri, san-serif;font-size: 26px;margin-top: 25px;margin-bottom: 5px">${elementActive.climateActionName}</p>
                </div>
                `;

          for (
            let index = 0;
            index < elementActive.assessments.length;
            index++
          ) {
            const assessment = elementActive.assessments[index];

            const assesActivity = await this.assessment
              .createQueryBuilder('assessment')

              .leftJoinAndMapMany(
                'assessment.assessmentYear',

                AssessmentYear,

                'assYr',

                'assYr.assessmentId = assessment.id and assYr.verificationStatus = 7',
              )

              .leftJoinAndMapOne(
                'assessment.methodology',

                Methodology,

                'meth',

                'meth.id = assessment.methodologyId',
              )

              .leftJoinAndMapOne(
                'assYr.assessmentResult',

                AssessmentResult,

                'assRslt',

                'assRslt.assessmentYearId = assYr.id',
              )

              .leftJoinAndMapMany(
                'assessment.parameters',

                Parameter,

                'para',

                'para.assessmentId = assessment.id and ((para.isEnabledAlternative = true and para.isAlternative=true) or (para.isEnabledAlternative = false and para.isAlternative = false))',
              )

              .leftJoinAndMapMany(
                'assessment.projectionResult',

                ProjectionResult,

                'proRslt',

                'proRslt.assessmentId = assessment.id',
              )

              .where('assessment.id = :id and assYr.id IN(:...ids)', {
                id: assessment.id,
                ids: reportData.yearIds,
              })
              .orderBy('assYr.assessmentYear', 'ASC')

              .getOne();

            const yearsActivity: number[] = [];
            let parameters = assesActivity?.parameters.filter(para => para.verifierAcceptance !== VerifierAcceptance.REJECTED)
            let groupedActivity = await parameters?.reduce(async (r, v, i, a) => {

              if (v.isDefault == true) {
                v.defaultValue = await this.defaultValueService.findOne(v.defaultValueId)
              }
              let foundyears = yearsActivity.find((element) => {
                return element == v.AssessmentYear ? v.AssessmentYear : v.baseYear
              });



              if (foundyears == undefined) {
                yearsActivity.push(v.AssessmentYear ? v.AssessmentYear : v.baseYear)
              }

              let found = (await r).find((element) => {
                return (element['name'] == v.name && (element['isBaseline'] === v.isBaseline && element['isProject'] === v.isProject))
              });


              if (found == undefined) {
                (await r).push({ 'name': v.name, 'unit': v.uomDataRequest ? v.uomDataRequest : v.uomDataEntry, 'years': [{ 'year': v.AssessmentYear ? v.AssessmentYear : v.baseYear, 'conValue': v.isDefault ? v.defaultValue.value ? v.defaultValue.value : "" : v.uomDataRequest ? v.conversionValue ? v.conversionValue :  v.value ? v.value : "" : v.value ? v.value : "" }] })
              } else {


                
                  found['years'].push({
                    year: v.AssessmentYear ? v.AssessmentYear : v.baseYear,
                    conValue: v.isDefault
                      ? v.defaultValue.value
                        ? v.defaultValue.value
                        : ''
                      : v.uomDataRequest
                      ? v.conversionValue
                        ? v.conversionValue
                        :  v.value ? v.value : ""
                      : v.value
                      ? v.value
                      : '',
                  });
                  r[(await r).indexOf(found)] = found;
                }

                return r;
              },
              Promise.resolve([]),
            );

            if (
              assessment.assessmentType == 'Ex-ante' ||
              assessment.assessmentType == 'Ex-post' ||
              assessment.assessmentType == 'MAC'
            ) {
              if (assesActivity) {
                this.commenAssestmentActivity = assesActivity;
                const map = Array.prototype.map;
                activitiData =
                  activitiData +
                  `
                  <div>
                    <table style="border:1px solid black;width:100%;">
                              <thead >
                              <tr style="height:40px; width:450px; margin:0;background-color: #3ba4ed !important;">
                                <th style="border:1px solid black;text-align: center;width:300px;font-size: 17px" scope="col">Parameter</th>
                                <th style="border:1px solid black;text-align: center;width:75px;font-size: 17px;" scope="col">Unit</th>
                                ${map
                                  .call(
                                    yearsActivity,
                                    (e: any) =>
                                      `
                                <th style="border:1px solid black;text-align: center;width:75px;font-size: 17px;" scope="col">${e}</th>
                                `,
                                  )
                                  .join('')}
                              </tr>
                              </thead>
                              <tbody>
                                ${map
                                  .call(
                                    groupedActivity,
                                    (e: { [x: string]: any }) =>
                                      `
                                  <tr style="height:30px; width:450px; margin:0">
                                  <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${
                                    e['name']
                                  }</td>
                                  <td style="border:1px solid black;width:75px">&nbsp&nbsp&nbsp&nbsp${
                                    e['unit']
                                  }</td>
                                  ${map
                                    .call(
                                      e['years'],
                                      (e: { [x: string]: any }) =>
                                        `
                                    <td style="border:1px solid black;width:75px">&nbsp&nbsp&nbsp&nbsp${
                                      e['conValue'] ? e['conValue'] : ''
                                    }</td>
                                    `,
                                    )
                                    .join('')}
                                  
                                  <tr>
                                  `,
                                  )
                                  .join('')}
                              </tbody>
                              </table>
                  </div>
                  `;
              }
            }
          }
        }
      }
    }

    let tableReportContent = '';

    for (let i = 0; i < reportData.ndcIdList.length; i++) {
      this.ndcItemList = reportData.ndcIdList[i];
      const ndcItem = await this.ndc.findOne({
        where: {
          id: reportData.ndcIdList[i],
        },
      });
      tableReportContent =
        tableReportContent +
        `
          <h3 style="font-weight: 700;color: #15246e;font-family: Calibri, san-serif;font-size: 32px;">${ndcItem.name}</h3>
          `;

      for (let i = 0; i < reportData.projIds.length; i++) {
        const climateData = await this.proRepo
          .createQueryBuilder('climate')
          .innerJoinAndSelect('climate.ndc', 'ndc')
          .innerJoinAndSelect('climate.assessments', 'assessments')
          .innerJoinAndSelect('climate.projectOwner', 'projectOwner')
          .innerJoinAndSelect('climate.projectStatus', 'projectStatus')
          .where('climate.id = :id', { id: reportData.projIds[i] })
          .andWhere('climate.ndcId = :ndcId', { ndcId: this.ndcItemList })
          .getOne();

        if (climateData) {
          const element = climateData;

          tableReportContent =
            tableReportContent +
            `<div class="mb-5 mt-5">
                <div>
                  <h4 style="font-weight: 600;color: #15246e;font-family: Calibri, san-serif;font-size: 25px;">${element.climateActionName}</h4>
                  <p style="font-size:15px">${element.climateActionName} ${element.institution} by ${element.projectOwner.name} to ${element.objective}. Action includes ${element.projectScope}. The geographical boundary of the project includes ${element.subNationalLevl1}, ${element.subNationalLevl2}, ${element.subNationalLevl3}. ${element.projectStatus.name}
                  It is expected that the project will ${element.outcome}. In addition, mitigation action has various sustainable development benefits such as ${element.directSDBenefit} and ${element.indirectSDBenefit}</p>
                </div>
              </div>`;


          
            for await(let assessment of element.assessments) {

            const asses = await this.assessment
              .createQueryBuilder('assessment')

              .leftJoinAndMapMany(
                'assessment.assessmentYear',

                AssessmentYear,

                'assYr',

                'assYr.assessmentId = assessment.id and assYr.verificationStatus = 7',
              )

              .leftJoinAndMapOne(
                'assessment.methodology',

                Methodology,

                'meth',

                'meth.id = assessment.methodologyId',
              )

              .leftJoinAndMapOne(
                'assYr.assessmentResult',

                AssessmentResult,

                'assRslt',

                'assRslt.assessmentYearId = assYr.id',
              )

              .leftJoinAndMapMany(
                'assessment.parameters',

                Parameter,

                'para',

                'para.assessmentId = assessment.id',
              )

              .leftJoinAndMapMany(
                'assessment.projectionResult',

                ProjectionResult,

                'proRslt',

                'proRslt.assessmentId = assessment.id',
              )

              .where('assessment.id = :id and assYr.id IN(:...ids)', {
                id: assessment.id,
                ids: reportData.yearIds,
              })

              .getOne();

           

            if (
              assessment.assessmentType == 'Ex-ante' ||
              assessment.assessmentType == 'Ex-post'
            ) {
              let emmisionReduction = '';
              let projectionEmission = '';
              if (asses) {

                if (assessment.assessmentType == 'Ex-ante') {
               
                    await this.generateProjectionEmmisionGrpah(
                      assessment.id,
                      element.id,
                    );
               
               
                }
                this.assessmentMetholodgy = asses;

                this.commenAssestment = asses;

                for (const assessmentYer of this.commenAssestment
                  .assessmentYear) {
                  let maxYear = 0;

                  this.commenAssestment.projectionResult.map(
                    (e: { projectionYear: number }) => {
                      if (e.projectionYear > maxYear) {
                        maxYear = e.projectionYear;
                      }
                    },
                  );

                  this.temporalBoundaryear =
                    maxYear === 0 ? assessmentYer.assessmentYear : maxYear;

                  this.commenAssestment?.parameters?.map((e: any) => {
                    this.isCheckLekage = e.isLekage;
                  });

                  if (assessmentYer.assessmentResult) {
                    const emisiionResult = assessmentYer.assessmentResult;

                    emmisionReduction =
                      emmisionReduction +
                      `<div style="margin-top:25px;margin-bottom:15px">
                        <p style="font-size:15px">Emissions estimated for ${
                          assessmentYer?.assessmentYear
                        } are summarized in Table 9. According to the table, ${
                        element.climateActionName
                      } reduce ${emisiionResult.totalEmission} tCO2e in the ${
                        assessmentYer.assessmentYear
                      }.</p>
                        <p style="font-size:15px">Table Emissions reduction due to ${
                          element.climateActionName
                        }</p>
                        <table style="border:1px solid black;width:100%;">
                              <thead > 
                                <tr style="height:40px; width:450px; margin:0;background-color: #3ba4ed !important;">
                                <th style="border:1px solid black;text-align: center;width:225px;font-size: 17px;" scope="col">Scenario</th>
                                <th style="border:1px solid black;text-align: center;width:225px;font-size: 17px;" scope="col">${
                                  assessmentYer?.assessmentYear
                                } Emissions (tCO2)</th>     
                                </tr>
                            </thead>
                            <tbody>
                                 
                                  <tr style="height:30px; width:450px; margin:0;">
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbspBaseline emissions</td>
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbsp${
                                    emisiionResult?.baselineResult
                                  }</td>
                                  </tr>
                                  <tr style="height:30px; width:450px; margin:0;">
                                    <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbspProject emissions</td>
                                    <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbsp${
                                      emisiionResult?.projectResult
                                    }</td>
                                  </tr>
                                  <tr style="height:30px; width:450px; margin:0;">
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbspLekage reductions</td>
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbsp${
                                    emisiionResult?.lekageResult === null
                                      ? 'N/A'
                                      : emisiionResult?.lekageResult
                                  }</td>
                                  </tr>
                                  <tr style="height:30px; width:450px; margin:0;">
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbspEmission reductions</td>
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbsp${
                                    emisiionResult?.totalEmission
                                  }</td>
                                  </tr>
                              </tbody>
                            </table>
                      </div>
                      `;

                    if (assessment.assessmentType === 'Ex-ante') {
                      projectionEmission =
                        projectionEmission +
                        `
                              <div style="margin-top:25px;margin-bottom:15px">
                              <h4>Projection of GHG Emissions</h4>
                              <p style="font-size:15px">GHG emissions attributed to the ${element.climateActionName} are projected to ${assessmentYer?.assessmentYear} considering the ${assessment.projectionBaseYear} based on the ${assessment.projectionIndicator}.   Figure 3 illustrates the BAU and project emissions of the ${element.climateActionName}.</p>
                              <div>
                              <p style="font-size:15px">Table: Projection emissions attributed to ${element.climateActionName}</p>
                              <table style="border:1px solid black;width:100%;">
                                <thead >
                                <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                                  <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Year</th>
                                  <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Baseline Result (tCO2e)</th>
                                  <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Project Result (tCO2e)</th>
                                  <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Leakage Result (tCO2e)</th>
                                  <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Emission Reduction (tCO2e)</th>
                                </tr>
                                </thead>
                                <tbody>
                                
                                      ${this.projectionDataResults?.map((e) => {
                                    return `<tr style="height:30px; width:450px; margin:0;">
                                    <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${e.projectionYear}</td>
                                    <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${e.projectionBasetot ? e.projectionBasetot : '&nbsp&nbsp&nbsp&nbsp-'}</td>
                                    <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${e.projectionProjecttot ? e.projectionProjecttot : '&nbsp&nbsp&nbsp&nbsp-'}</td>
                                    <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${e.projectionLekagetot ? e.projectionLekagetot : '&nbsp&nbsp&nbsp&nbsp-'}</td>
                                    <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${e.emissionReduction ? e.emissionReduction : '&nbsp&nbsp&nbsp&nbsp-'}</td>
                                  </tr>`;
                                  }
                                )}
                                  
                                </tbody>
                              </table>
                              <div><img src="${process.env.BASE_URL}/graph` + assessment.id.toString() + `.png"` + ` alt="Italian Trulli"></div>
                              <p>Figure ${grpsfigurnumber}: BAU and project emissions of ${element.climateActionName}</p>
                              </div>
                              </div>
                              `;
                              grpsfigurnumber++
                    }
                  }
                }

                tableReportContent =
                  tableReportContent +
                  `
                        <div style="margin-top:25px;margin-bottom:15px">
                          <div>
                            <h4 style="color: #15246e;font-family: Calibri, san-serif;font-size: 23px">GHG impact assessment</h4>
                            <h4 style="color: #15246e;font-family: Calibri, san-serif;font-size: 20px">System boundary</h4>
                            <p style="font-size:15px">Table System boundary of the GHG impact assessment of ${
                              element.climateActionName
                            }</p>
                            <table style="border:1px solid black;width:100%">
                            <thead >
                            <tr style="height:40px; width:450px; margin:0;background-color: #3ba4ed !important;">
                              <th style="border:1px solid black;text-align: center;width:150px;font-size: 17px;" scope="col"}>Boundary elements</th>
                              <th style="border:1px solid black;text-align: center;width:300px;font-size: 17px;" scope="col">Description</th>
                            </tr>
                            </thead>
                            <tbody>
                              <tr style="height:40px; width:450px; margin:0;">
                                <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspGeographic Boundary</td>
                                <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${
                                  element.subNationalLevl1 === null
                                    ? 'N/A'
                                    : element.subNationalLevl1
                                }, ${
                    element.subNationalLevl2 === null
                      ? 'N/A'
                      : element.subNationalLevl2
                  }, ${
                    element.subNationalLevl3 === null
                      ? 'N/A'
                      : element.subNationalLevl3
                  }</td>
                              </tr>
                              <tr style="height:40px; width:450px; margin:0;">
                                <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspTemporal Boundary</td>
                                <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${element.proposeDateofCommence.getFullYear()} - ${
                    this.temporalBoundaryear
                  } </td>
                              </tr>
                              <tr style="height:40px; width:450px; margin:0;">
                                <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspTransport subsector</td>
                                <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${
                                  this.assessmentMetholodgy?.methodology
                                    ?.transportSubSector
                                }</td>
                              </tr>
                              <tr style="height:40px; width:450px; margin:0;">
                                <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspUpstream/downstream</td>
                                <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${
                                  this.assessmentMetholodgy?.methodology
                                    ?.upstream_downstream
                                    ? this.assessmentMetholodgy?.methodology
                                        ?.upstream_downstream
                                    : 'N/A'
                                }</td>
                              </tr>
                              <tr style="height:40px; width:450px; margin:0;">
                                <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspGHGs Included</td>
                                <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${
                                  this.assessmentMetholodgy?.methodology
                                    ?.ghgIncluded
                                }</td>
                              </tr>
                            </tbody>
                            </table>
                          </div>
                        </div>
                        `;

                tableReportContent =
                  tableReportContent +
                  `
                              <div style="margin-top:25px;margin-bottom:15px">
                                  <h4 style="color: #15246e;font-family: Calibri, san-serif;font-size: 20px">Measurement</h4>
                                  <table style="border:1px solid black;width:100%;">
                                  <tbody>
                                    <tr style="height:40px; width:450px; margin:0;">
                                      <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspAssessment Approach</td>
                                      <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${
                                        assessment.assessmentType
                                      }</td>
                                    </tr>
                                    <tr style="height:40px; width:450px; margin:0;">
                                      <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspBase Year</td>
                                      <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${
                                        assessment.baseYear
                                      }</td>
                                    </tr>
                                    <tr style="height:40px; width:450px; margin:0;">
                                      <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspAssessment year(s)</td>
                                      <td style="border:1px solid black;width:300px">
                                      &nbsp&nbsp&nbsp&nbsp${this.commenAssestment?.assessmentYear?.map(
                                        (e: { assessmentYear: any }) => {
                                          return e.assessmentYear;
                                        },
                                      )}
                                      </td>
                                    </tr>
                                    <tr style="height:40px; width:450px; margin:0;">
                                      <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspMethodology</td>
                                      <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${
                                        this.assessmentMetholodgy?.methodology
                                          .displayName
                                      }</td>
                                    </tr>
                                  </tbody>
                                  </table>
                                </div>
                              `;

                tableReportContent =
                  tableReportContent +
                  `
                          <div style="margin-top:25px;margin-bottom:15px">
                          <h4 style="color: #15246e;font-family: Calibri, san-serif;font-size: 20px">Baseline Scenario</h4>
                          <h4>${assessment.baselineScenario}</h4>
                          <p style="font-size:15px">Table Data required to assess baseline emissions of ${
                            element.climateActionName
                          }</p>
                           
                             
                            <table style="border:1px solid black;width:100%;">
                            <thead >
                            <tr style="height:40px; width:450px; margin:0;background-color: #3ba4ed !important;">
                              <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Key indicators</th>
                              <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Unit</th>
                            </tr>
                            </thead>
                            <tbody>
                              ${this.commenAssestment.parameters
                                .map(
                                  (ele: any) => `
                              ${
                                ele.isBaseline
                                  ? `
                              <tr style="height:40px; width:450px; margin:0">
                              <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${
                                ele.name
                              }</td>
                              <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${
                                ele.uomDataRequest ? ele.uomDataRequest : 'N/A'
                              }</td>
                              </tr>
                              `
                                  : ''
                              }
                              `,
                                )
                                .join('')}
                            </tbody>
                            </table>
                            `;

                tableReportContent =
                  tableReportContent +
                  `
                         <div style="margin-top:25px;margin-bottom:15px">
                            <h4>Baseline emissions attributed to the ${
                              element.climateActionName
                            } are given in Table.</h4>
                            <p style="font-size:15px">Table Baseline emissions of ${
                              element.climateActionName
                            }</p>
                            <table style="border:1px solid black;width:100%;">
                            <thead >
                            <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                              <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Year</th>
                              <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Emissions (tCO2e)</th>
                            </tr>
                            </thead>
                            <tbody>
                              
                                
                                  ${this.commenAssestment?.assessmentYear?.map(
                                    (e: {
                                      assessmentYear: any;
                                      assessmentResult: { baselineResult: any };
                                    }) => {
                                      return `<tr style="height:30px; width:450px; margin:0;">
                      <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${
                        e.assessmentYear
                      }</td>
                        <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${
                          e.assessmentResult
                            ? e.assessmentResult.baselineResult
                              ? e.assessmentResult.baselineResult
                              : '&nbsp&nbsp&nbsp&nbsp-'
                            : '&nbsp&nbsp&nbsp&nbsp-'
                        }</td>
                        </tr>`;
                                    },
                                  )}
                                
                                
                              
                            </tbody>
                            </table>
                        </div>
                       `;

                tableReportContent =
                  tableReportContent +
                  `
                       <div style="margin-top:25px;margin-bottom:15px">
                       <h4 style="color: #15246e;font-family: Calibri, san-serif;font-size: 20px">Project Scenario</h4>
                       <h4>${assessment.projectScenario}</h4>
                       <p style="font-size:15px">Table: Data required to assess project emissions of ${
                         element.climateActionName
                       }</p>
                        
             
                         <table style="border:1px solid black;width:100%;">
                         <thead >
                         <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                           <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Key indicators</th>
                           <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Unit</th>
                         </tr>
                         </thead>
                         <tbody>
                           ${this.commenAssestment.parameters
                             .map(
                               (e: {
                                 isProject: boolean;
                                 name: any;
                                 uomDataRequest: any;
                               }) =>
                                 `
                      ${
                        e.isProject
                          ? `<tr style="height:40px; width:450px; margin:0;">
                      <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${
                        e.name
                      }</td>
                      <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${
                        e.uomDataRequest ? e.uomDataRequest : 'N/A'
                      }</td>
                      </tr>`
                          : ''
                      }
                             
                             `,
                             )
                             .join('')}
                         </tbody>
                         </table>
                        `;

                tableReportContent =
                  tableReportContent +
                  `
                         <div style="margin-top:25px;margin-bottom:15px">
                            <p style="font-size:15px">Direct project emissions attributed to the ${
                              element.climateActionName
                            } are given in Table 6. </p>
                            <p style="font-size:15px">Table: Direct project emissions attributed to ${
                              element.climateActionName
                            }</p>
                            <table style="border:1px solid black;width:100%;">
                            <thead >
                            <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                              <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Year</th>
                              <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Emissions (tCO2e)</th>
                            </tr>
                            </thead>
                            <tbody>
                             
                                  ${this.commenAssestment?.assessmentYear?.map(
                                    (e: {
                                      assessmentYear: any;
                                      assessmentResult: { projectResult: any };
                                    }) => {
                                      return `<tr style="height:30px; width:450px; margin:0;">
                      <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${
                        e.assessmentYear
                      }</td>
                        <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${
                          e.assessmentResult
                            ? e.assessmentResult.projectResult
                              ? e.assessmentResult.projectResult
                              : '&nbsp&nbsp&nbsp&nbsp-'
                            : '&nbsp&nbsp&nbsp&nbsp-'
                        }</td>
                        </tr>`;
                                    },
                                  )}
                               
                            </tbody>
                            </table>
                        </div>
                       `;

                if (this.isCheckLekage == true) {
                  tableReportContent =
                    tableReportContent +
                    `
                          <div style="margin-top:25px;margin-bottom:15px">
                          <h4 style="color: #15246e;font-family: Calibri, san-serif;font-size: 20px">Lekage Scenario</h4>
                          <p style="font-size:15px">Table gives the key indicators used to assess the emissions due to leakages. Please see Annex 1 for activity data and the sources.</p>
                          <p style="font-size:15px">Table Data required to assess leakage emissions of ${
                            element.climateActionName
                          }</p>
                          <table style="border:1px solid black;width:100%;">
                             <thead >
                               <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                                <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Key indicators</th>
                                <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Unit</th>
                              </tr>
                            </thead>
                            <tbody>
                            ${this.commenAssestment.parameters
                              .map(
                                (ele: any) => `
                                ${
                                  ele.isLekage
                                    ? `
                            <tr style="height:40px; width:450px; margin:0">
                            <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${
                              ele.name
                            }</td>
                            <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${
                              ele.uomDataRequest ? ele.uomDataRequest : 'N/A'
                            }</td>
                            </tr>
                            `
                                    : ''
                                }
                            `,
                              )
                              .join('')}
                            </tbody>
                           </table>
                        </div>
                          `;
                }

                if (this.isCheckLekage == true) {
                  tableReportContent =
                    tableReportContent +
                    `
                          <div style="margin-top:25px;margin-bottom:15px">
                          <p style="font-size:15px">Indirect project emissions attributed to the ${
                            element.climateActionName
                          } are given in Table 8</p>
                          <p style="font-size:15px">Table Leakage emissions of ${
                            element.climateActionName
                          }</p>
                          <table style="border:1px solid black;width:100%;">
                          <thead >
                          <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                            <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Year</th>
                            <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Emissions (tCO2e)</th>
                          </tr>
                          </thead>
                          <tbody>
                              ${this.commenAssestment?.assessmentYear?.map(
                                (e: {
                                  assessmentYear: any;
                                  assessmentResult: { lekageResult: any };
                                }) => {
                                  return `<tr style="height:30px; width:450px; margin:0;">
                            <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${
                              e.assessmentYear
                            }</td><td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${
                                    e.assessmentResult
                                      ? e.assessmentResult.lekageResult
                                        ? e.assessmentResult.lekageResult
                                        : '&nbsp&nbsp&nbsp&nbsp-'
                                      : '&nbsp&nbsp&nbsp&nbsp-'
                                  }</td></tr>`;
                                },
                              )}
                      
                          </tbody>
                          </table>
                          </div>
                          `;
                }

                tableReportContent =
                  tableReportContent +
                  `
                  ${emmisionReduction}
                        
                    `;
                tableReportContent =
                  tableReportContent +
                  `
                  ${projectionEmission}
                  <hr/>
                `;
              }
            } else if (assessment.assessmentType == 'MAC') {
              if (asses) {
                tableReportContent =
                  tableReportContent +
                  `
                <div style="margin-top:25px;margin-bottom:15px">
                <h4 style="color: #15246e;font-family: Calibri, san-serif;font-size: 23px">Cost of climate action</h4>
                <p style="font-size:15px">The marginal abatement cost (MAC), in general, measures the cost of reducing one more unit of pollution. Table 10 indicates the MAC of ${
                  element.climateActionName
                }. </p>
                <p style="font-size:15px">Table 10 MAC of the ${
                  element.climateActionName
                }</p>
                <table style="border:1px solid black;width:100%;">
                  <thead >
                  <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                    <th style="border:1px solid black;text-align: center;width:200px;font-size: 17px;" scope="col">Year</th>
                    <th style="border:1px solid black;text-align: center;width:250px;font-size: 17px;" scope="col">MAC (USD/tCO2e)</th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr style="height:30px; width:450px; margin:0;">
                      <td style="border:1px solid black;width:200px;">
                      &nbsp&nbsp&nbsp&nbsp${this.commenAssestment?.assessmentYear?.map(
                        (e: { assessmentYear: any }) => {
                          return e.assessmentYear;
                        },
                      )}
                      </td>
                      <td style="border:1px solid black;width:250px;">&nbsp&nbsp&nbsp&nbsp${
                        assessment.macValue
                      }</td>
                    <tr>
                  </tbody>
                  </table>
                </div>
                <hr/>
                <hr/>
              `;
              }
            }
          }
        }
      }
    }

    const summryReport: any[] =
      await this.assessmentYearService.getDataForReportNew(
        reportData.projIds.join(','),
        reportData.assessType.join(','),
        reportData.yearIds.join(','),
        reportData.macAssecmentType.join(','),
      );

    let tableContent = '';
    for (let index = 0; index < summryReport.length; index++) {
      const element = summryReport[index];

      tableContent =
        tableContent +
        `<tr>
        <th>${element.NDC}</th>
        <th>${element.ClimateAction}</th>
        <th>${element.Year}</th>
        <th>${
          element.Type == 'MAC'
            ? 'MAC ' + element.TypeOfMac
            : 'GHG ' + element.Type
        }</th>
        <th>${
          element.Type != 'MAC'
            ? element.Result
            : element.EmmisionValue
            ? element.EmmisionValue
            : 'N/A'
        }</th>
        <th>${element.MACResult ? element.MACResult : 'N/A'}</th>
        </tr>`;
    }

    let setSectorId: number = reportData.sectorIds[0];
    if (reportData.selectAllSectors == true) {
      setSectorId = 0;
    }
    const graphData =
      await this.emissionReductionDraftDataService.getEmissionReductionDraftDataForReport(
        setSectorId,
        countryIdFromTocken,
        sectorIdFromTocken,
      );

    const unconditionalValue =
      graphData.targetYearEmission - graphData.unconditionaltco2;

    const conditionalValue =
      graphData.targetYearEmission - graphData.conditionaltco2;

    let totalExPost = 0;
    for (const sum of summryReport) {
      if (sum.Type == 'Ex-post') {
        totalExPost = totalExPost + Number(sum.Result);
      }
    }

    const paragraph = `
      <div style="text-align: justify;text-justify: inter-word;">
      ${
        unconditionalValue
          ? `<p style="font-size:15px">Figure 1 illustrates the status of achieving emissions reduction targets
      of ${reportData.sectors} sector of ${reportData.country}. The expected emission
      reduction of the ${reportData.sectors} sector by ${graphData.targetYear} year is
      ${conditionalValue} MtCO₂e conditionally, and
      ${unconditionalValue} MtCO₂e unconditionally.
      Mitigation actions implemented by year ${graphData.targetYear} were able to reduce
      ${reportData.sectors} sector emissions from
      ${totalExPost} MtCO2e.</p>`
          : `
      <p style="font-size:15px">
      Figure 1 illustrates the status of achieving emissions reduction targets
        of ${reportData.sectors} sector of ${reportData.country}. The expected emission
        reduction of the ${reportData.sectors} sector by ${graphData.targetYear} year is
        ${conditionalValue} MtCO₂e. Mitigation actions
        implemented by year ${graphData.targetYear} were able to reduce
        ${reportData.sectors} sector emissions from
        ${totalExPost} tCO₂e.
      </p>`
      }
        
      </div>
    `;

    const datetime = await this.generateChart(summryReport, graphData);
  

    let userName: string;

    [userName] = this.tokenDetails.getDetails([TokenReqestType.username]);
    const selectedUser = await this.usersService.findByUserName(userName);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const d = new Date();
    const month = months[d.getMonth()];
    const year = d.getUTCFullYear();

    const coverPage = `
    <div style="display:flex;flex-direction:column;height:1000px;justify-content: space-around;align-items: center;background-color: #3bbbcd !important;">
            <div style="display:flex;flex-direction:column;align-items: center;justify-content: center;text-align: center">
              <h1 style="font-size: 50px;color: white !important">${reportData.reportName}</h1>
            </div>
            <div style="display:flex;flex-direction:column;align-items: center;justify-content: center;text-align: center">
              <h1 style="color: white!important"">${month} ${year}</h1>
              <h3 style="color: white!important"">${selectedUser.institution.name}</h3>
            </div>
            <div style="display:flex;flex-direction:column;align-items: center;justify-content: center;text-align: center">
              <h4 style="color: white!important"">Prepared By</h4>
              <h4 style="color: white!important"">${selectedUser.firstName} ${selectedUser.lastName}</h4>
            </div>
    </div>
    `;

    const file = {
      content:
        `<!DOCTYPE html>
        <html lang="en">
        <head>
        <title>Bootstrap Example</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <style>
            .table td, .table th {
            font-size: 15px;
            font-weight:normal;  }
        </style>
        </head>
        <body>` +
        `
        <div class="container">
          ${coverPage}
        </div>
        
        <div class="container-fluid mb-5">
        <h1>Executive Summary</h1>
        </div>
        <div class="container-fluid mb-5">
        <table>
        <tbody>
        <tr class="table-primary">
          <td style="width: 250px; padding-left: 100px; white-space: nowrap">
            <h5>Report Name:</h5>
          </td>
         <td><h5>${reportData.reportName}</h5></td>
        </tr>
        <tr class="table-primary">
          <td style="width: 250px; padding-left: 100px"><h5>Sector(s):</h5></td>
          <td><h5>${reportData.sectors}</h5></td>
        </tr>
        <tr class="table-primary">
          <td style="width: 250px; padding-left: 100px">
            <h5>Year(s):</h5>
          </td>
          <td><h5>${reportData.years}</h5></td>
        </tr>
        </tbody>
        </table>
      </div>` +
        ` <div class="container-fluid mb-5 mt-5"> 
          <div class="mb-4">
        <h6>
        Table 1: Summary of the assessments of climate actions in
        ${reportData.sectors.toString()} sector
        </h6>
      </div>
        <table class="table table-striped"><thead>
       <tr>
      <th scope="col">Aggregated Actions</th>
      <th scope="col">Specific Climate Actions</th>
      <th scope="col">Year</th>
      <th scope="col">Type</th>
      <th scope="col"><h5>Emission Reduction</h5>(tCO₂e)</th>
      <th scope="col"><h5>MAC</h5>(tCO₂e/USD)</th>
      </tr></thead><tbody>${tableContent}</tbody>
      </table></div> 
      <div class="container-fluid mb-5" >${paragraph}</div>
      <div><img src="${
        process.env.BASE_URL
      }/reportPDF_${datetime}.png" alt="Italian Trulli"></div>
      <div><p>Figure 1 Emissions reduction of ${reportData.sectors.toString()} sector of ${
          reportData.country
        }</p></div>
        <p><strong>Note:</strong> Only the emission reductions of Climate Actions calculated Ex-post using the tool are reflected in the Actual Emissions curve</p>

        <br>
      <div class="mb-5 mt-5">${tableReportContent} </div>
      <div class="mb-5 mt-5">${activitiData}</div>
      </body></html>`,
    }; 
    const fileName = `reportPDF_${datetime}.pdf`; 
    const options = {
      format: 'A4',
      margin: { top: '50px', bottom: '50px', left: '50px', right: '50px' },
      path: './public/' + fileName,
      printBackground: true,
  
    };




    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath:'/usr/bin/chromium-browser',
      args: ['--no-sandbox']
     
    });

    setTimeout(async () => {
      const page = await browser.newPage();
      await page.setContent(file.content, { waitUntil: 'domcontentloaded' });
      await page.emulateMediaType('print');
      const PDF = await page.pdf(options);
      await browser.close();
  
      const filePath = `./public/${fileName}`;
  
      try {
      const fileContent =await fsPromises.readFile(filePath);
     
        await this.storageService.save(
          'public/' + fileName,
          'application/pdf',
          fileContent,
          [{ mediaId: fileName }]
        );
      } catch (e) {
        if (e.message.toString().includes("No such object")) {
          throw new NotFoundException("file not found");
        } else {
          throw new ServiceUnavailableException("internal error");
        }
      }
    },100)
    return fileName;

   
  }
  async createnormalpdf(){

    const fileName = `reportPDF.pdf`; 
    const options = {
      format: 'A4',
      margin: { top: '50px', bottom: '50px', left: '50px', right: '50px' },
      path: './public/' + fileName,
      printBackground: true,
      preferCSSPageSize: true,
    };


  

    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath:'/usr/bin/chromium-browser',
      args: ['--no-sandbox']
    });
    let test=`<!DOCTYPE html>
    <html lang="en">
    <head>
    <title>Bootstrap Example</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
   
   
    </head>
    <body></body>test</html>`
    const page = await browser.newPage();
    await page.setContent(test, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('print');
    const PDF = await page.pdf(options);
    await browser.close();


    return fileName;

  }
}
