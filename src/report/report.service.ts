import { EmissionReductioDraftDataEntity } from './../master-data/emisssion-reduction-draft-data/entity/emission-reductio-draft-data.entity';
import { promises } from 'fs';
import { type } from 'os';
import { Injectable, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
// import ChartJSImage from 'chart.js-image';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Assessment } from 'src/assesment/entity/assesment.entity';
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
import { In, Like, Repository } from 'typeorm';
import { ProjectService } from 'src/project/project.service';
import { AssessmentResault } from 'src/assesment-resault/entity/assessment-resault.entity';
import axios from 'axios';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { ProjectOwner } from 'src/master-data/project-owner/projeect-owner.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { AssesmentService } from 'src/assesment/assesment.service';
const path = require('path');
import { readdir } from 'fs/promises';
import { ReportPdfInsert } from './dto/reportPdfInsert.dto';
import { ReportPdfFileData } from './entity/report-pdfFile.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { ProjectionResault } from 'src/projection-resault/entity/projection-resault.entity';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { UsersService } from 'src/users/users.service';
import { async } from 'rxjs';
import { DefaultValueService } from 'src/default-value/default-value.service';

@Injectable()
export class ReportService extends TypeOrmCrudService<Report> {
  constructor(
    @InjectRepository(Report) repo,
    private readonly usersService: UsersService,
    private readonly assessmentYearService: AssessmentYearService,
    private readonly assessmentService: AssesmentService,
    private readonly projectService: ProjectService,
    private readonly defaultValueService: DefaultValueService,
    private readonly tokenDetails: TokenDetails,
    @InjectRepository(EmissionReductioDraftDataEntity)
    private readonly graphRepository: Repository<EmissionReductioDraftDataEntity>,
    @InjectRepository(Project) private readonly proRepo: Repository<Project>,
    @InjectRepository(Assessment)
    private readonly assesment: Repository<Assessment>,
    @InjectRepository(AssessmentYear)
    private readonly assesmentYearResults: Repository<AssessmentYear>,
    @InjectRepository(ReportPdfFileData)
    private readonly reportPdfFileData: Repository<ReportPdfFileData>,
    @InjectRepository(Ndc) private readonly ndc: Repository<Ndc>,
    @InjectRepository(Parameter) private readonly parameter: Repository<Parameter>,
    @InjectRepository(ProjectOwner)
    private readonly projectOwner: Repository<ProjectOwner>,
    @InjectRepository(AssessmentResault)
    private readonly assResRepo: Repository<AssessmentResault>,
  ) {
    super(repo);
  }

  public ndcItemList: any;
  public ndcItemListActivity: any;
  public asesmentYears: any;
  public assesmentMetholodgy: any;
  public assesmentParameter: any;
  public assesmentResult: any;
  public commenAssestment: any;
  public commenAssestmentActivity: any;
  public assestmentYerResult: any;
  public temporalBoundaryear: any;
  public unquieYears: any;
  public baseLineResultConcat: any;
  public projectResultConcat: any;
  public isCheckLekage: any;

  public assementBaseLineResultYears: any[] = [];
  public assementBaseLineResult: any[] = [];

  public assementProjectResultYears: any[] = [];
  public assementProjectResult: any[] = [];

  public projectionBaseLineResultYears: any[] = [];
  public projectionBaseLineResult: any[] = [];

  public projectionProjectResultYears: any[] = [];
  public projectionProjectResult: any[] = [];

  public projectionBaseResul: any[] = [];
  public assementProjectResultWithYears: any[] = [];
  //public dataCollectionArray: any[] = [];

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
    // console.log('selected type',assessmentType)

    let filter: string = '';
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
        // console.log('ewwwww',assessmentType)
        filter = `${filter} and asse.assessmentType = :assessmentType`;
      } else {
        filter = `asse.assessmentType = :assessmentType`;
      }
      // filter = '(asse.assessmentType LIKE :assessmentType)';
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

    var data = this.repo
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
        countryId,
        sectorId,
        ndcId,
        projectId,
        assessmentType,
      })
      .orderBy('rep.createdOn', 'DESC');

    let resualt = await paginate(data, options);

    // console.log(data.getQuery());
    if (resualt) {
      return resualt;
    }
  }

  async getPdfReportFiles() {
    // let ext = path.extname('./public')
    // console.log("===== ext +++++", ext);

    try {
      const dirpath = path.join(__dirname, './public');
      const files = await readdir('./public');
      // const txtFiles = files.filter(el => path.extname(el) === '.pdf')
      // console.log("======== txtFiles", txtFiles);
      let pdfFiles = [];
      for (let file of files) {
        //console.log("======== txtFiles", file);
        if (path.extname(file) === '.pdf') {
          pdfFiles.push(file);
        }
      }

      return pdfFiles;
    } catch (err) {
      console.error(err);
    }
  }

  async generateChart(
    years: number[],
    projIds: string[],
    assessType: string[],
  ): Promise<string> {
    // console.log('climateActionIds',projIds)
    let BAUList: Number[] = [];
    let ConditionalList: Number[] = [];
    let UnConditionalList: Number[] = [];
    let ActualList: Number[] = [];
    let assessmentListId: Number[] = [];
    let currentYear: number = new Date().getFullYear();
    let climateAcList: Project[] = await this.proRepo.find({
      where: { id: In(projIds) },
      relations: ['assessments'],
    });

    // console.log("projects",climateAcList)
    for (let a = 0; a < climateAcList.length; a++) {
      // console.log("assesResult3",climateAcList[a].assessments)
      if (climateAcList[a].assessments) {
        // console.log("assesResult2")
        for (let b = 0; b < climateAcList[a].assessments.length; b++) {
          assessmentListId.push(climateAcList[a].assessments[b]?.id);
        }
      }
    }

    // console.log("assessmentListId",assessmentListId)

    const ChartJSImage = require('chart.js-image');
    let graphData = await this.graphRepository.findOne({ id: 1 });
    // console.log('graphData', graphData);
    years.push(parseInt(graphData.baseYear));
    years.push(parseInt(graphData.targetYear));
    years = years.sort(function (a, b) {
      return a - b;
    });

    // console.log('years', years);

    years = years.filter(function (o) {
      return (
        o >= parseInt(graphData.baseYear) && o <= parseInt(graphData.targetYear)
      );
    });
    // console.log('years', years);
    let unconditionalValue =
      graphData.targetYearEmission - graphData.unconditionaltco2;

    let conditionalValue =
      graphData.targetYearEmission - graphData.conditionaltco2;

    let yrGap = parseInt(graphData.targetYear) - parseInt(graphData.baseYear);
    let baseYear = parseInt(graphData.baseYear);

    //  this.projectService.getProjectsForCountryAndSectorAdmins()

    for (let year of years) {
      // console.log("work testay",year)
      let total = 0;

      let bauValue: number =
        ((graphData.targetYearEmission - graphData.baseYearEmission) / yrGap) *
        (year - baseYear) +
        graphData.baseYearEmission;
      ConditionalList.push(!graphData.conditionaltco2 && graphData.conditionaltco2 == 0 ? 0 :
        ((conditionalValue - graphData.baseYearEmission) / yrGap) *
        (year - baseYear) +
        graphData.baseYearEmission,
      );
      UnConditionalList.push(!graphData.unconditionaltco2 && graphData.unconditionaltco2 == 0 ? 0 :
        ((unconditionalValue - graphData.baseYearEmission) / yrGap) *
        (year - baseYear) +
        graphData.baseYearEmission,
      );
      BAUList.push(bauValue);
      if (year <= currentYear) {
        let assesResult = await this.assResRepo.find({
          where: {
            assessmentYear: { assessmentYear: year },
            assement: {
              assessmentType: In(assessType),
              id: In(assessmentListId),
            },
          },
          relations: ['assessmentYear', 'assement'],
        });
        // console.log("assesResult1")
        // console.log("assesResult",assesResult)
        if (assesResult.length > 0) {
          for (let assement of assesResult) {
            // console.log("totalemition",assement.totalEmission)
            total += assement.totalEmission ? assement.totalEmission : 0;
            // console.log(total)
          }

          ActualList.push(bauValue - total / 1000000);
        } else {
          ActualList.push(bauValue);
        }
      }

      // this.postYrList.push(total);
    }
    // console.log('ActualList', ActualList);
    // console.log('BAUList', BAUList);
    const line_chart = ChartJSImage()
      .chart({
        type: 'line',
        data: {
          labels: years, ///['2010', '2011', '2012', '2013', '2014', '2015', '2016'],

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
      }) // Line chart
      .backgroundColor('white')
      .width(500) // 500px
      .height(300); // 300px

    let datetime: string = new Date().getTime().toString();

    //line_chart.toURL(); // String: https://image-charts.com/chart.js/2.8.0?icac=documentation&chart=%7Btype%3A%27line%27%2Cdata%3A%7Blabels%3A%5B%27January%27%2C%27February%27%2C%27March%27%2C%27April%27%2C%27May%27%2C%27June%27%2C%27July%27%5D%2Cdatasets%3A%5B%7Blabel%3A%27My+First+dataset%27%2CborderColor%3A%27rgb%28255%2C+99%2C+132%29%27%2CbackgroundColor%3A%27rgba%28255%2C+99%2C+132%2C+.5%29%27%2Cdata%3A%5B57%2C90%2C11%2C-15%2C37%2C-37%2C-27%5D%7D%2C%7Blabel%3A%27My+Second+dataset%27%2CborderColor%3A%27rgb%2854%2C+162%2C+235%29%27%2CbackgroundColor%3A%27rgba%2854%2C+162%2C+235%2C+.5%29%27%2Cdata%3A%5B71%2C-36%2C-94%2C78%2C98%2C65%2C-61%5D%7D%2C%7Blabel%3A%27My+Third+dataset%27%2CborderColor%3A%27rgb%2875%2C+192%2C+192%29%27%2CbackgroundColor%3A%27rgba%2875%2C+192%2C+192%2C+.5%29%27%2Cdata%3A%5B48%2C-64%2C-61%2C98%2C0%2C-39%2C-70%5D%7D%2C%7Blabel%3A%27My+Third+dataset%27%2CborderColor%3A%27rgb%28255%2C+205%2C+86%29%27%2CbackgroundColor%3A%27rgba%28255%2C+205%2C+86%2C+.5%29%27%2Cdata%3A%5B-58%2C88%2C29%2C44%2C3%2C78%2C-9%5D%7D%5D%7D%2Coptions%3A%7Bresponsive%3Atrue%2Ctitle%3A%7Bdisplay%3Atrue%2Ctext%3A%27Chart.js+Line+Chart+-+Stacked+Area%27%7D%2Ctooltips%3A%7Bmode%3A%27index%27%7D%2Chover%3A%7Bmode%3A%27index%27%7D%2Cscales%3A%7BxAxes%3A%5B%7BscaleLabel%3A%7Bdisplay%3Atrue%2ClabelString%3A%27Month%27%7D%7D%5D%2CyAxes%3A%5B%7Bstacked%3Atrue%2CscaleLabel%3A%7Bdisplay%3Atrue%2ClabelString%3A%27Value%27%7D%7D%5D%7D%7D%7D&bkg=white&width=700&height=390&icretina=1&ichm=922e17b749b1ab7fab2a14cb742029dc46e50e658457913a9f548793910d2a0d
    line_chart.toFile(`./public/reportPDF_${datetime}.png`); // Promise<()>
    return datetime
    //line_chart.toDataURI(); // Promise<String> : data:image/png;base64,iVBORw0KGgo...
    //line_chart.toBuffer(); // Promise<Buffer> : Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 ...
  }


  async generateChartForDownlord(
    years: number[],
    projIds: string[],
    assessType: string[],
  ) {
    // console.log('climateActionIds',projIds)
    let BAUList: Number[] = [];
    let ConditionalList: Number[] = [];
    let UnConditionalList: Number[] = [];
    let ActualList: Number[] = [];
    let assessmentListId: Number[] = [];
    let currentYear: number = new Date().getFullYear();
    let climateAcList: Project[] = await this.proRepo.find({
      where: { id: In(projIds) },
      relations: ['assessments'],
    });

    // console.log("projects",climateAcList)
    for (let a = 0; a < climateAcList.length; a++) {
      // console.log("assesResult3",climateAcList[a].assessments)
      if (climateAcList[a].assessments) {
        // console.log("assesResult2")
        for (let b = 0; b < climateAcList[a].assessments.length; b++) {
          assessmentListId.push(climateAcList[a].assessments[b]?.id);
        }
      }
    }

    // console.log("assessmentListId",assessmentListId)

    const ChartJSImage = require('chart.js-image');
    let graphData = await this.graphRepository.findOne({ id: 1 });
    // console.log('graphData', graphData);
    years.push(parseInt(graphData.baseYear));
    years.push(parseInt(graphData.targetYear));
    years = years.sort(function (a, b) {
      return a - b;
    });

    // console.log('years', years);

    years = years.filter(function (o) {
      return (
        o >= parseInt(graphData.baseYear) && o <= parseInt(graphData.targetYear)
      );
    });
    // console.log('years', years);
    let unconditionalValue =
      graphData.targetYearEmission - graphData.unconditionaltco2;

    let conditionalValue =
      graphData.targetYearEmission - graphData.conditionaltco2;

    let yrGap = parseInt(graphData.targetYear) - parseInt(graphData.baseYear);
    let baseYear = parseInt(graphData.baseYear);

    //  this.projectService.getProjectsForCountryAndSectorAdmins()

    for (let year of years) {
      // console.log("work testay",year)
      let total = 0;

      let bauValue: number =
        ((graphData.targetYearEmission - graphData.baseYearEmission) / yrGap) *
        (year - baseYear) +
        graphData.baseYearEmission;
      ConditionalList.push(!graphData.conditionaltco2 && graphData.conditionaltco2 == 0 ? 0 :
        ((conditionalValue - graphData.baseYearEmission) / yrGap) *
        (year - baseYear) +
        graphData.baseYearEmission,
      );
      UnConditionalList.push(!graphData.unconditionaltco2 && graphData.unconditionaltco2 == 0 ? 0 :
        ((unconditionalValue - graphData.baseYearEmission) / yrGap) *
        (year - baseYear) +
        graphData.baseYearEmission,
      );
      BAUList.push(bauValue);
      if (year <= currentYear) {
        let assesResult = await this.assResRepo.find({
          where: {
            assessmentYear: { assessmentYear: year },
            assement: {
              assessmentType: In(assessType),
              id: In(assessmentListId),
            },
          },
          relations: ['assessmentYear', 'assement'],
        });
        // console.log("assesResult1")
        // console.log("assesResult",assesResult)
        if (assesResult.length > 0) {
          for (let assement of assesResult) {
            // console.log("totalemition",assement.totalEmission)
            total += assement.totalEmission ? assement.totalEmission : 0;
            // console.log(total)
          }

          ActualList.push(bauValue - total / 1000000);
        } else {
          ActualList.push(bauValue);
        }
      }

      // this.postYrList.push(total);
    }
    // console.log('ActualList', ActualList);
    // console.log('BAUList', BAUList);
    const line_chart = ChartJSImage()
      .chart({
        type: 'line',
        data: {
          labels: years, ///['2010', '2011', '2012', '2013', '2014', '2015', '2016'],

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
      }) // Line chart
      .backgroundColor('white')
      .width(500) // 500px
      .height(300); // 300px

    let datetime: string = new Date().getTime().toString();
    //line_chart.toURL(); // String: https://image-charts.com/chart.js/2.8.0?icac=documentation&chart=%7Btype%3A%27line%27%2Cdata%3A%7Blabels%3A%5B%27January%27%2C%27February%27%2C%27March%27%2C%27April%27%2C%27May%27%2C%27June%27%2C%27July%27%5D%2Cdatasets%3A%5B%7Blabel%3A%27My+First+dataset%27%2CborderColor%3A%27rgb%28255%2C+99%2C+132%29%27%2CbackgroundColor%3A%27rgba%28255%2C+99%2C+132%2C+.5%29%27%2Cdata%3A%5B57%2C90%2C11%2C-15%2C37%2C-37%2C-27%5D%7D%2C%7Blabel%3A%27My+Second+dataset%27%2CborderColor%3A%27rgb%2854%2C+162%2C+235%29%27%2CbackgroundColor%3A%27rgba%2854%2C+162%2C+235%2C+.5%29%27%2Cdata%3A%5B71%2C-36%2C-94%2C78%2C98%2C65%2C-61%5D%7D%2C%7Blabel%3A%27My+Third+dataset%27%2CborderColor%3A%27rgb%2875%2C+192%2C+192%29%27%2CbackgroundColor%3A%27rgba%2875%2C+192%2C+192%2C+.5%29%27%2Cdata%3A%5B48%2C-64%2C-61%2C98%2C0%2C-39%2C-70%5D%7D%2C%7Blabel%3A%27My+Third+dataset%27%2CborderColor%3A%27rgb%28255%2C+205%2C+86%29%27%2CbackgroundColor%3A%27rgba%28255%2C+205%2C+86%2C+.5%29%27%2Cdata%3A%5B-58%2C88%2C29%2C44%2C3%2C78%2C-9%5D%7D%5D%7D%2Coptions%3A%7Bresponsive%3Atrue%2Ctitle%3A%7Bdisplay%3Atrue%2Ctext%3A%27Chart.js+Line+Chart+-+Stacked+Area%27%7D%2Ctooltips%3A%7Bmode%3A%27index%27%7D%2Chover%3A%7Bmode%3A%27index%27%7D%2Cscales%3A%7BxAxes%3A%5B%7BscaleLabel%3A%7Bdisplay%3Atrue%2ClabelString%3A%27Month%27%7D%7D%5D%2CyAxes%3A%5B%7Bstacked%3Atrue%2CscaleLabel%3A%7Bdisplay%3Atrue%2ClabelString%3A%27Value%27%7D%7D%5D%7D%7D%7D&bkg=white&width=700&height=390&icretina=1&ichm=922e17b749b1ab7fab2a14cb742029dc46e50e658457913a9f548793910d2a0d
    await line_chart.toFile(`./public/chart_${datetime}.png`); // Promise<()>
    return `chart_${datetime}.png`
    //line_chart.toDataURI(); // Promise<String> : data:image/png;base64,iVBORw0KGgo...
    //line_chart.toBuffer(); // Promise<Buffer> : Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 ...
  }

  async generateProjectionEmmisionGrpah(id: number, projectId: number) {
    let assesementDataResults = await this.assesment
      .createQueryBuilder('assesment')
      .innerJoinAndSelect('assesment.assessmentYear', 'assessmentYear')
      .innerJoinAndSelect('assesment.assessmentResult', 'assessmentResult')
      .select(
        'assesment.projectId, assessmentYear.assessmentYear, assessmentResult.baselineResult as baseLineTot, assessmentResult.projectResult as projectTot',
      )
      .where('assesment.id = :id', { id: id })
      .orderBy('assessmentYear.assessmentYear')
      .execute();

    let projectionDataResults = await this.assesment
      .createQueryBuilder('assesment')
      .innerJoinAndSelect('assesment.projectionResult', 'projectionResult')
      .select(
        'projectionResult.projectionYear, projectionResult.baselineResult as projectionBasetot, projectionResult.projectResult as projectionProjecttot',
      )
      .where('assesment.id = :id', { id: id })
      .orderBy('projectionResult.projectionYear')
      .execute();

    let dataCollectionArray = [];
    let year = [];
    let baseLineRes = [];
    let projectionRes = [];
    for (let assesment of assesementDataResults) {
      //console.log("assesment ========", assesment);
      year.push(assesment.assessmentYear);
      baseLineRes.push(
        assesment.baseLineTot ? parseInt(assesment.baseLineTot) : 0,
      );
      projectionRes.push(
        assesment.projectTot ? parseInt(assesment.projectTot) : 0,
      );
    }

    for (let projection of projectionDataResults) {
      // console.log("projectionRes ========", projectionRes);
      year.push(projection.projectionYear);
      baseLineRes.push(
        projection.projectionBasetot ? projection.projectionBasetot : 0,
      );
      projectionRes.push(
        projection.projectionProjecttot ? projection.projectionProjecttot : 0,
      );
    }

    //console.log("dataCollectionArray ========", dataCollectionArray);

    const ChartJSImage = require('chart.js-image');

    const line_chart = ChartJSImage()
      .chart({
        type: 'line',
        data: {
          labels: year,
          datasets: [
            {
              label: 'BAU Scenario Emissions(tCO₂)',
              borderColor: 'rgb(54,+162,+235)',
              backgroundColor: 'rgba(54,+162,+235,+.5)',
              data: baseLineRes,
            },
            {
              label: 'Project Scenario Emissions(tCO₂)',
              borderColor: 'rgb(255,+99,+132)',
              backgroundColor: 'rgba(255,+99,+132,+.5)',
              data: projectionRes,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Project Emmisions Of BAU and Project Scenarios(tCO₂)',
          },
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
      }) // Line chart
      .backgroundColor('white')
      .width(500) // 500px
      .height(300); // 300px

    //line_chart.toURL(); // String: https://image-charts.com/chart.js/2.8.0?icac=documentation&chart=%7Btype%3A%27line%27%2Cdata%3A%7Blabels%3A%5B%27January%27%2C%27February%27%2C%27March%27%2C%27April%27%2C%27May%27%2C%27June%27%2C%27July%27%5D%2Cdatasets%3A%5B%7Blabel%3A%27My+First+dataset%27%2CborderColor%3A%27rgb%28255%2C+99%2C+132%29%27%2CbackgroundColor%3A%27rgba%28255%2C+99%2C+132%2C+.5%29%27%2Cdata%3A%5B57%2C90%2C11%2C-15%2C37%2C-37%2C-27%5D%7D%2C%7Blabel%3A%27My+Second+dataset%27%2CborderColor%3A%27rgb%2854%2C+162%2C+235%29%27%2CbackgroundColor%3A%27rgba%2854%2C+162%2C+235%2C+.5%29%27%2Cdata%3A%5B71%2C-36%2C-94%2C78%2C98%2C65%2C-61%5D%7D%2C%7Blabel%3A%27My+Third+dataset%27%2CborderColor%3A%27rgb%2875%2C+192%2C+192%29%27%2CbackgroundColor%3A%27rgba%2875%2C+192%2C+192%2C+.5%29%27%2Cdata%3A%5B48%2C-64%2C-61%2C98%2C0%2C-39%2C-70%5D%7D%2C%7Blabel%3A%27My+Third+dataset%27%2CborderColor%3A%27rgb%28255%2C+205%2C+86%29%27%2CbackgroundColor%3A%27rgba%28255%2C+205%2C+86%2C+.5%29%27%2Cdata%3A%5B-58%2C88%2C29%2C44%2C3%2C78%2C-9%5D%7D%5D%7D%2Coptions%3A%7Bresponsive%3Atrue%2Ctitle%3A%7Bdisplay%3Atrue%2Ctext%3A%27Chart.js+Line+Chart+-+Stacked+Area%27%7D%2Ctooltips%3A%7Bmode%3A%27index%27%7D%2Chover%3A%7Bmode%3A%27index%27%7D%2Cscales%3A%7BxAxes%3A%5B%7BscaleLabel%3A%7Bdisplay%3Atrue%2ClabelString%3A%27Month%27%7D%7D%5D%2CyAxes%3A%5B%7Bstacked%3Atrue%2CscaleLabel%3A%7Bdisplay%3Atrue%2ClabelString%3A%27Value%27%7D%7D%5D%7D%7D%7D&bkg=white&width=700&height=390&icretina=1&ichm=922e17b749b1ab7fab2a14cb742029dc46e50e658457913a9f548793910d2a0d
    line_chart.toFile('./public/graph' + id.toString() + '.png'); // Promise<()>
  }

  async genarateMacGraph(
    assementYears: number[],
    assementType: string[],
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

    //console.log("countryIdFromTocken", countryIdFromTocken)
    //console.log("sectorIdFromTocken", sectorIdFromTocken)

    //console.log("prjectIds", prjectIds)
    assementType = assementType
      .filter(function (item, pos) {
        return assementType.indexOf(item) == pos;
      })
      .map((a) => a.replace(/'/g, ''));
    //console.log("assementType", assementType)
    let resault =
      await this.assessmentYearService.getAssessmentYearsWiseMacGraphDataToSummeryReport(
        {
          limit: 0,
          page: 0,
        },
        isPost,
        0,
        countryIdFromTocken,
        sectorIdFromTocken,
        assementYears,
        assementType,
        prjectIds,
      );

    // let resault= await this.assessmentYearService.getAssessmentYearsForCountryAndSectorAdmins({
    //   limit: 0,
    //   page: 0,
    //   },
    //   0,
    //   countryIdFromTocken,
    //   sectorIdFromTocken,
    //  );
    //console.log("yearresuktlist", resault)
    const assementYearWiseList = new Map();
    resault.items.forEach((assyesr: { assessmentYear: any; }) => {
      const key = assyesr.assessmentYear;
      const collection = assementYearWiseList.get(key);
      if (!collection) {
        assementYearWiseList.set(key, [assyesr]);
      } else {
        collection.push(assyesr);
      }
    });

    // console.log(assementYearWiseList);
    const graphsYearWise = [];
    const graphsData = new Map();
    assementYearWiseList.forEach(async function (value, key) {
      let projects: string[] = [];
      let ers: number[] = [];
      let macs: number[] = [];
      // console.log(key + " = " + value);
      for (let assYr of value) {
        //  console.log('prject',assYr.assessment.project.climateActionName);
        //  console.log('ers',assYr.assessmentResault?assYr.assessmentResault.totalEmission:0);
        //  console.log('macs',assYr.assessmentResault?assYr.assessmentResault.macResult?assYr.assessmentResault.macResult:0:0);
        // if(!projects.includes(assYr.assessment.project.climateActionName) && assYr.assessmentResault &&assYr.assessmentResault.totalEmission&& assYr.assessmentResault.totalEmission > 0 && assYr.assessmentResault.macResult ){
        //   projects.push(assYr.assessment.project.climateActionName);
        //   ers.push(assYr.assessmentResault.totalEmission);
        //  macs.push(assYr.assessmentResault.macResult);
        // }
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

      // console.log(projects);
      // console.log(ers);
      // console.log(macs);
    });
    console.log(typeof graphsData);
    for (let gr of graphsData) {
      // console.log('gr',gr[1])
      await axios
        .post('http://localhost:8000/image', gr[1])
        .then((res) => {
          // console.log(res.data)
          graphsYearWise.push([gr[0], res.data]);

          // console.log('graphsYearWise',graphsYearWise)
        })
        .catch((err) => {
          // console.log(err)
        });
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
    let res = await this.parameter.createQueryBuilder('para')
      .innerJoinAndSelect('para.assessment', 'asses')
      .where('para.AssessmentYear = :AssessmentYear', { AssessmentYear: assesYear })
      .andWhere('asses.id = :id', { id: assesId })
      .orderBy('para.isBaseline', 'DESC')
      .getMany()

    return res;
  }

  async savePdfFileData(pdfData: ReportPdfInsert): Promise<any> {
    let response = await this.reportPdfFileData.insert(pdfData);

    return response;
  }



  async getPdfFileData(
    ndcName: string,
    climateAction: string,
    sectorName: string,
    reportName: string,
    countryIdFromTocken: number
  ) {
    let res = [];
    if (!ndcName && !climateAction && !sectorName && !reportName) {
      res = await this.reportPdfFileData.find({
        where: {

          countryId: countryIdFromTocken
        },
      });
    } else {
      res = await this.reportPdfFileData.find({
        where: {
          ndcName: Like(`%${ndcName}%`),
          climateAction: Like(`%${climateAction}%`),
          sectorName: Like(`%${sectorName}%`),
          reportName: Like(`%${reportName}%`),
          countryId: countryIdFromTocken
        },
      });
    }

    //console.log("===== get file data ndcNameId",sectorname);
    return res;
  }

  // async testChart(reportData: ReportDataPDF, chartname: string): Promise<any> {

  //   await this.generateChartForDownlord(
  //     reportData.years,
  //     reportData.projIds,
  //     reportData.assessType,
  //     chartname
  //   );
  // }

  async testPDF(reportData: ReportDataPDF): Promise<string> {
    //  await this.getPdfFileData()
    let datetime = await this.generateChart(
      reportData.years,
      reportData.projIds,
      reportData.assessType,
    );

    // let macHtmlpost = await this.genarateMacGraph(reportData.years, reportData.assessType,
    //   reportData.projIds, 0
    // )
    // let macHtmlante = await this.genarateMacGraph(reportData.years, reportData.assessType,
    //   reportData.projIds, 1
    // )
    // console.log('macHtml', macHtml)
    let graphData = await this.graphRepository.findOne({ id: 1 });

    const html_to_pdf = require('html-pdf-node');

    //let datetime: string = new Date().getTime().toString();

    let fileName = `reportPDF_${datetime}.pdf`;
    //let fileName = `reportPDF`;
    let options = {
      format: 'A4',
      margin: { top: '50px', bottom: '50px', left: '50px', right: '50px' },
      path: './public/' + fileName,
      printBackground: true
    };



    let activitiData: string = '';
    activitiData =
      activitiData +
      `
                <div>
                  <h2 style="font-weight: 700;color: #15246e;font-family: Calibri, san-serif;font-size: 32px;">Activity data</h2>
                </div>
              `

    for (let i = 0; i < reportData.ndcIdList.length; i++) {
      this.ndcItemListActivity = reportData.ndcIdList[i];
      var ndcItem = await this.ndc.findOne({
        where: {
          id: reportData.ndcIdList[i]
        }
      });
      for (let i = 0; i < reportData.projIds.length; i++) {
        let climateDataActivity = await this.proRepo
          .createQueryBuilder('climate')
          .innerJoinAndSelect('climate.ndc', 'ndc')
          .innerJoinAndSelect('climate.assessments', 'assessments')
          .innerJoinAndSelect('assessments.assessmentYear', 'assessmentYear')
          .innerJoinAndSelect('climate.projectOwner', 'projectOwner')
          .innerJoinAndSelect('climate.projectStatus', 'projectStatus')
          .where('climate.id = :id', { id: reportData.projIds[i] })
          .andWhere('climate.ndcId = :ndcId', { ndcId: this.ndcItemListActivity })
          .andWhere('assessmentYear.verificationStatus = 7')
          .getOne();



        // console.log("climateData=====", climateData.length);

        // for (let index = 0; index < climateData.length; index++) {
        if (climateDataActivity && climateDataActivity.assessments.length > 0) {
          // const element = climateData[index];
          const elementActive = climateDataActivity;
          //console.log("climateDataActivity====", climateDataActivity.assessments);



          activitiData =
            activitiData +
            `
                <div>
                  <p style="font-weight: 700;font-family: Calibri, san-serif;font-size: 26px;margin-top: 25px;margin-bottom: 5px">${elementActive.climateActionName}</p>
                </div>
                `

          for (let index = 0; index < elementActive.assessments.length; index++) {
            const assesment = elementActive.assessments[index];

            //console.log("++++++++++ assesment +++++++", assesment);
            var assesActivity = await this.assesment
              .createQueryBuilder('assesment')

              .leftJoinAndMapMany(
                'assesment.assessmentYear',

                AssessmentYear,

                'assYr',

                'assYr.assessmentId = assesment.id and assYr.verificationStatus = 7',
              )

              .leftJoinAndMapOne(
                'assesment.methodology',

                Methodology,

                'meth',

                'meth.id = assesment.methodologyId',
              )

              .leftJoinAndMapOne(
                'assYr.assessmentResult',

                AssessmentResault,

                'assRslt',

                'assRslt.assessmentYearId = assYr.id',
              )

              .leftJoinAndMapMany(
                'assesment.parameters',

                Parameter,

                'para',

                'para.assessmentId = assesment.id',
              )

              .leftJoinAndMapMany(
                'assesment.projectionResult',

                ProjectionResault,

                'proRslt',

                'proRslt.assementId = assesment.id',
              )

              .where('assesment.id = :id and assYr.id IN(:...ids)', {
                id: assesment.id,
                ids: reportData.yearIds,

              })
              .orderBy("assYr.assessmentYear", "ASC")

              .getOne();



            let yearsActivity: number[] = []
            let groupedActivity =await assesActivity?.parameters.reduce(async (r, v, i, a) => {

              if(v.isDefault==true){
                v.defaultValue=await this.defaultValueService.findOne(v.defaultValueId)
               }
              //  console.log("default",v.defaultValue)
                let foundyears = yearsActivity.find((element) => {
                  return element == v.AssessmentYear ? v.AssessmentYear : v.baseYear
                });
  
  
  
                if (foundyears == undefined) {
                  yearsActivity.push(v.AssessmentYear ? v.AssessmentYear : v.baseYear)
                }
  
                let found = (await r).find((element) => {
                  return element['name'] == v.name
                });
  
  
                if (found == undefined) {
                  (await r).push({ 'name': v.name, 'unit': v.uomDataRequest?v.uomDataRequest:v.uomDataEntry, 'years': [{ 'year': v.AssessmentYear ? v.AssessmentYear : v.baseYear, 'conValue':v.isDefault?v.defaultValue.value?v.defaultValue.value:"":v.uomDataRequest? v.conversionValue ? v.conversionValue : "":v.value?v.value:"" }] })
                } else {
  
  
                  found['years'].push({ 'year': v.AssessmentYear ? v.AssessmentYear : v.baseYear, 'conValue':v.isDefault?v.defaultValue.value?v.defaultValue.value:"": v.uomDataRequest? v.conversionValue ? v.conversionValue : "":v.value?v.value:"" })
                  r[(await r).indexOf(found)] = found
                }
  
                return r;
              }, Promise.resolve([]));

            //console.log("===== groupe +++++", groupedActivity);
            // groupedActivity.forEach(e => console.log("==== group years", e['years']))


            if (
              assesment.assessmentType == 'Ex-ante' ||
              assesment.assessmentType == 'Ex-post' ||
              assesment.assessmentType == 'MAC'
            ) {

              if (assesActivity) {
                this.commenAssestmentActivity = assesActivity;
                const map = Array.prototype.map
                activitiData =
                  activitiData +
                  `
                  <div>
                    <table style="border:1px solid black;width:100%;">
                              <thead >
                              <tr style="height:40px; width:450px; margin:0;background-color: #3ba4ed !important;">
                                <th style="border:1px solid black;text-align: center;width:300px;font-size: 17px" scope="col">Parameter</th>
                                <th style="border:1px solid black;text-align: center;width:75px;font-size: 17px;" scope="col">Unit</th>
                                ${map.call(yearsActivity, (e: any) =>
                    `
                                <th style="border:1px solid black;text-align: center;width:75px;font-size: 17px;" scope="col">${e}</th>
                                `
                  ).join("")}
                              </tr>
                              </thead>
                              <tbody>
                                ${map.call(groupedActivity, (e: { [x: string]: any; }) =>
                    `
                                  <tr style="height:30px; width:450px; margin:0">
                                  <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${e['name']}</td>
                                  <td style="border:1px solid black;width:75px">&nbsp&nbsp&nbsp&nbsp${e['unit']}</td>
                                  ${map.call(e['years'], (e: { [x: string]: any; }) =>
                      `
                                    <td style="border:1px solid black;width:75px">&nbsp&nbsp&nbsp&nbsp${e['conValue'] ? e['conValue'] : ""}</td>
                                    `
                    ).join("")}
                                  
                                  <tr>
                                  `
                  ).join("")}
                              </tbody>
                              </table>
                  </div>
                  `
              }

            }



          }
        }
      }
    }




    // main report start
    let tableReportContent: string = '';
    // selected ndc list itterate
    for (let i = 0; i < reportData.ndcIdList.length; i++) {
      this.ndcItemList = reportData.ndcIdList[i];
      var ndcItem = await this.ndc.findOne({
        where: {
          id: reportData.ndcIdList[i],
        },
      });
      tableReportContent =
        tableReportContent +
        `
          <h3 style="font-weight: 700;color: #15246e;font-family: Calibri, san-serif;font-size: 32px;">${ndcItem.name}</h3>
          `;

      // selected projects itterated
      for (let i = 0; i < reportData.projIds.length; i++) {
        let climateData = await this.proRepo
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

              // itterate assesment according to a selected projec assesment id
          for (let index = 0; index < element.assessments.length; index++) {
            const assesment = element.assessments[index];

            var asses = await this.assesment
              .createQueryBuilder('assesment')

              .leftJoinAndMapMany(
                'assesment.assessmentYear',

                AssessmentYear,

                'assYr',

                'assYr.assessmentId = assesment.id and assYr.verificationStatus = 7',
              )

              .leftJoinAndMapOne(
                'assesment.methodology',

                Methodology,

                'meth',

                'meth.id = assesment.methodologyId',
              )

              .leftJoinAndMapOne(
                'assYr.assessmentResult',

                AssessmentResault,

                'assRslt',

                'assRslt.assessmentYearId = assYr.id',
              )

              .leftJoinAndMapMany(
                'assesment.parameters',

                Parameter,

                'para',

                'para.assessmentId = assesment.id',
              )

              .leftJoinAndMapMany(
                'assesment.projectionResult',

                ProjectionResault,

                'proRslt',

                'proRslt.assementId = assesment.id',
              )

        
              .where('assesment.id = :id and assYr.id IN(:...ids)', {
                id: assesment.id,
                ids: reportData.yearIds,
              })

              .getOne();

            if (assesment.assessmentType == 'Ex-ante') {
            
              await this.generateProjectionEmmisionGrpah(
                assesment.id,
                element.id,
              );
            }

            if (
              assesment.assessmentType == 'Ex-ante' ||
              assesment.assessmentType == 'Ex-post'
            ) {
              
              let emmisionReduction: string = '';
              let projectionEmission: string = '';
              if (asses) {
                this.assesmentMetholodgy = asses;
               

                this.commenAssestment = asses;
                

                for (let assesmentYer of this.commenAssestment.assessmentYear) {
                
                  let maxYear = 0;

                  this.commenAssestment.projectionResult.map((e: { projectionYear: number; }) => {
                    if (e.projectionYear > maxYear) {
                      maxYear = e.projectionYear;
                    }
                  });

                  this.temporalBoundaryear =
                    maxYear === 0 ? assesmentYer.assessmentYear : maxYear;


                  this.commenAssestment?.parameters?.map((e: any) => {
                    

                    this.isCheckLekage = e.isLekage
                  })
                 
                  if (assesmentYer.assessmentResult) {
                    let emisiionResult = assesmentYer.assessmentResult;
                  
                    emmisionReduction =
                      emmisionReduction +
                      `<div style="margin-top:25px;margin-bottom:15px">
                        <p style="font-size:15px">Emissions estimated for ${assesmentYer?.assessmentYear} are summarized in Table 9. According to the table, ${element.climateActionName} reduce ${emisiionResult.totalEmission} tCO2e in the ${assesmentYer.assessmentYear}.</p>
                        <p style="font-size:15px">Table Emissions reduction due to ${element.climateActionName}</p>
                        <table style="border:1px solid black;width:100%;">
                              <thead > 
                                <tr style="height:40px; width:450px; margin:0;background-color: #3ba4ed !important;">
                                <th style="border:1px solid black;text-align: center;width:225px;font-size: 17px;" scope="col">Scenario</th>
                                <th style="border:1px solid black;text-align: center;width:225px;font-size: 17px;" scope="col">${assesmentYer?.assessmentYear} Emissions (MtCO2)</th>     
                                </tr>
                            </thead>
                            <tbody>
                                 
                                  <tr style="height:30px; width:450px; margin:0;">
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbspBaseline emissions</td>
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbsp${emisiionResult?.baselineResult}</td>
                                  </tr>
                                  <tr style="height:30px; width:450px; margin:0;">
                                    <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbspProject emissions</td>
                                    <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbsp${emisiionResult?.projectResult}</td>
                                  </tr>
                                  <tr style="height:30px; width:450px; margin:0;">
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbspLekage reductions</td>
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbsp${emisiionResult?.lekageResult === null ? "N/A" : emisiionResult?.lekageResult}</td>
                                  </tr>
                                  <tr style="height:30px; width:450px; margin:0;">
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbspEmission reductions</td>
                                  <td style="border:1px solid black;width:225px">&nbsp&nbsp&nbsp&nbsp${emisiionResult?.totalEmission}</td>
                                  </tr>
                              </tbody>
                            </table>
                      </div>
                      `;

                    if (assesment.assessmentType === 'Ex-ante') {
                      projectionEmission =
                        projectionEmission +
                        `
                              <div style="margin-top:25px;margin-bottom:15px">
                              <h4>Projection of GHG Emissions</h4>
                              <p style="font-size:15px">GHG emissions attributed to the ${element.climateActionName} are projected to ${emisiionResult?.assessmentYear} considering the ${assesment.projectionBaseYear} based on the ${assesment.projectionIndicator}.   Figure 3 illustrates the BAU and project emissions of the ${element.climateActionName}.</p>
                              <div>
                              <div><img src="http://localhost:7080/graph` + assesment.id.toString() + `.png"` + ` alt="Italian Trulli"></div>
                              <p>Figure 3: BAU and project emissions of ${element.climateActionName}</p>
                              </div>
                              </div>
                              `;
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
                            <p style="font-size:15px">Table System boundary of the GHG impact assessment of ${element.climateActionName}</p>
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
                                <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${element.subNationalLevl1 === null ? "N/A" : element.subNationalLevl1}, ${element.subNationalLevl2 === null ? "N/A" : element.subNationalLevl2}, ${element.subNationalLevl3 === null ? "N/A" : element.subNationalLevl3}</td>
                              </tr>
                              <tr style="height:40px; width:450px; margin:0;">
                                <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspTemporal Boundary</td>
                                <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${element.proposeDateofCommence.getFullYear()} - ${this.temporalBoundaryear
                  } </td>
                              </tr>
                              <tr style="height:40px; width:450px; margin:0;">
                                <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspTransport subsector</td>
                                <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${this.assesmentMetholodgy?.methodology
                    ?.transportSubSector
                  }</td>
                              </tr>
                              <tr style="height:40px; width:450px; margin:0;">
                                <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspUpstream/downstream</td>
                                <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${this.assesmentMetholodgy?.methodology
                    ?.upstream_downstream
                    ? this.assesmentMetholodgy?.methodology
                      ?.upstream_downstream
                    : 'N/A'
                  }</td>
                              </tr>
                              <tr style="height:40px; width:450px; margin:0;">
                                <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspGHGs Included</td>
                                <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${this.assesmentMetholodgy?.methodology
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
                                      <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${assesment.assessmentType
                  }</td>
                                    </tr>
                                    <tr style="height:40px; width:450px; margin:0;">
                                      <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspBase Year</td>
                                      <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${assesment.baseYear
                  }</td>
                                    </tr>
                                    <tr style="height:40px; width:450px; margin:0;">
                                      <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspAssessment year(s)</td>
                                      <td style="border:1px solid black;width:300px">
                                      &nbsp&nbsp&nbsp&nbsp${this.commenAssestment?.assessmentYear?.map(
                    (e: { assessmentYear: any; }) => {
                      
                      return e.assessmentYear;
                    }
                  )}
                                      </td>
                                    </tr>
                                    <tr style="height:40px; width:450px; margin:0;">
                                      <td style="border:1px solid black;width:150px">&nbsp&nbsp&nbsp&nbspMethodology</td>
                                      <td style="border:1px solid black;width:300px">&nbsp&nbsp&nbsp&nbsp${this.assesmentMetholodgy?.methodology
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
                          <h4>${assesment.baselineScenario}</h4>
                          <p style="font-size:15px">Table Data required to assess baseline emissions of ${element.climateActionName
                  }</p>
                           
                             
                            <table style="border:1px solid black;width:100%;">
                            <thead >
                            <tr style="height:40px; width:450px; margin:0;background-color: #3ba4ed !important;">
                              <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Key indicators</th>
                              <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Unit</th>
                            </tr>
                            </thead>
                            <tbody>
                              ${this.commenAssestment.parameters.map((ele: any) => `
                              ${ele.isBaseline ? `
                              <tr style="height:40px; width:450px; margin:0">
                              <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${ele.name}</td>
                              <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${ele.uomDataRequest ? ele.uomDataRequest : "N/A"}</td>
                              </tr>
                              ` : ""}
                              `).join("")}
                            </tbody>
                            </table>
                            `;

                tableReportContent =
                  tableReportContent +
                  `
                         <div style="margin-top:25px;margin-bottom:15px">
                            <h4>Baseline emissions attributed to the ${element.climateActionName
                  } are given in Table.</h4>
                            <p style="font-size:15px">Table Baseline emissions of ${element.climateActionName
                  }</p>
                            <table style="border:1px solid black;width:100%;">
                            <thead >
                            <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                              <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Year</th>
                              <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Emissions (MtCO2e)</th>
                            </tr>
                            </thead>
                            <tbody>
                              
                                
                                  ${this.commenAssestment?.assessmentYear?.map(
                    (e: { assessmentYear: any; assessmentResult: { baselineResult: any; }; }) => {
                      return `<tr style="height:30px; width:450px; margin:0;">
                      <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${e.assessmentYear
                        }</td>
                        <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${e.assessmentResult
                          ? e.assessmentResult.baselineResult
                            ? e.assessmentResult.baselineResult
                            : '&nbsp&nbsp&nbsp&nbsp-'
                          : '&nbsp&nbsp&nbsp&nbsp-'
                        }</td>
                        </tr>`;
                    }
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
                       <h4>${assesment.projectScenario}</h4>
                       <p style="font-size:15px">Table: Data required to assess project emissions of ${element.climateActionName
                  }</p>
                        
             
                         <table style="border:1px solid black;width:100%;">
                         <thead >
                         <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                           <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Key indicators</th>
                           <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Unit</th>
                         </tr>
                         </thead>
                         <tbody>
                           ${this.commenAssestment.parameters.map(
                    (e: { isProject: boolean; name: any; uomDataRequest: any; }) =>

                      `
                      ${e.isProject ? `<tr style="height:40px; width:450px; margin:0;">
                      <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${e.name}</td>
                      <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${e.uomDataRequest ? e.uomDataRequest : "N/A"}</td>
                      </tr>` : ""}
                             
                             `
                  ).join("")}
                         </tbody>
                         </table>
                        `;

                tableReportContent =
                  tableReportContent +
                  `
                         <div style="margin-top:25px;margin-bottom:15px">
                            <p style="font-size:15px">Direct project emissions attributed to the ${element.climateActionName
                  } are given in Table 6. </p>
                            <p style="font-size:15px">Table: Direct project emissions attributed to ${element.climateActionName
                  }</p>
                            <table style="border:1px solid black;width:100%;">
                            <thead >
                            <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                              <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Year</th>
                              <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Emissions (MtCO2e)</th>
                            </tr>
                            </thead>
                            <tbody>
                             
                                  ${this.commenAssestment?.assessmentYear?.map(
                    (e: { assessmentYear: any; assessmentResult: { projectResult: any; }; }) => {
                      return `<tr style="height:30px; width:450px; margin:0;">
                      <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${e.assessmentYear}</td>
                        <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${e.assessmentResult
                          ? e.assessmentResult.projectResult
                            ? e.assessmentResult.projectResult
                            : '&nbsp&nbsp&nbsp&nbsp-'
                          : '&nbsp&nbsp&nbsp&nbsp-'
                        }</td>
                        </tr>`;
                    }
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
                          <p style="font-size:15px">Table Data required to assess leakage emissions of ${element.climateActionName}</p>
                          <table style="border:1px solid black;width:100%;">
                             <thead >
                               <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                                <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Key indicators</th>
                                <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Unit</th>
                              </tr>
                            </thead>
                            <tbody>
                            ${this.commenAssestment.parameters.map((ele: any) => `
                                ${ele.isLekage ? `
                            <tr style="height:40px; width:450px; margin:0">
                            <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${ele.name}</td>
                            <td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${ele.uomDataRequest ? ele.uomDataRequest : "N/A"}</td>
                            </tr>
                            ` : ""}
                            `).join("")}
                            </tbody>
                           </table>
                        </div>
                          `
                }


                if (this.isCheckLekage == true) {
                  tableReportContent =
                    tableReportContent +
                    `
                          <div style="margin-top:25px;margin-bottom:15px">
                          <p style="font-size:15px">Indirect project emissions attributed to the ${element.climateActionName
                    } are given in Table 8</p>
                          <p style="font-size:15px">Table Leakage emissions of ${element.climateActionName
                    }</p>
                          <table style="border:1px solid black;width:100%;">
                          <thead >
                          <tr style="height:30px; width:450px; margin:0;background-color: #3ba4ed !important;">
                            <th style="border:1px solid black;text-align: center;width:350px;font-size: 17px;" scope="col">Year</th>
                            <th style="border:1px solid black;text-align: center;width:100px;font-size: 17px;" scope="col">Emissions (MtCO2e)</th>
                          </tr>
                          </thead>
                          <tbody>
                              ${this.commenAssestment?.assessmentYear?.map(
                      (e: { assessmentYear: any; assessmentResult: { lekageResult: any; }; }) => {
                        return `<tr style="height:30px; width:450px; margin:0;">
                            <td style="border:1px solid black;width:350px">&nbsp&nbsp&nbsp&nbsp${e.assessmentYear
                          }</td><td style="border:1px solid black;width:100px">&nbsp&nbsp&nbsp&nbsp${e.assessmentResult
                            ? e.assessmentResult.lekageResult
                              ? e.assessmentResult.lekageResult
                              : '&nbsp&nbsp&nbsp&nbsp-'
                            : '&nbsp&nbsp&nbsp&nbsp-'
                          }</td></tr>`;
                      }
                    )}
                      
                          </tbody>
                          </table>
                          </div>
                          `
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
            } else if (assesment.assessmentType == 'MAC') {
              if (asses) {
                tableReportContent =
                  tableReportContent +
                  `
                <div style="margin-top:25px;margin-bottom:15px">
                <h4 style="color: #15246e;font-family: Calibri, san-serif;font-size: 23px">Cost of climate action</h4>
                <p style="font-size:15px">The marginal abatement cost (MAC), in general, measures the cost of reducing one more unit of pollution. Table 10 indicates the MAC of ${element.climateActionName
                  }. </p>
                <p style="font-size:15px">Table 10 MAC of the ${element.climateActionName
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
                      &nbsp&nbsp&nbsp&nbsp${this.commenAssestment?.assessmentYear?.map((e: { assessmentYear: any; }) => {
                    return e.assessmentYear;
                  })}
                      </td>
                      <td style="border:1px solid black;width:250px;">&nbsp&nbsp&nbsp&nbsp${assesment.macValue}</td>
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

    // Example of options with args //
    // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

    let summryReport: any[] =
      await this.assessmentYearService.getDataForReportNew(
        reportData.projIds.join(','),
        reportData.assessType.join(','),
        reportData.yearIds.join(','),
        reportData.macAssecmentType.join(','),
      );

    let tableContent: string = '';
    for (let index = 0; index < summryReport.length; index++) {
      const element = summryReport[index];

      tableContent =
        tableContent +
        `<tr>
        <th>${element.NDC}</th>
        <th>${element.ClimateAction}</th>
        <th>${element.Year}</th>
        <th>${element.Type == 'MAC'
          ? 'MAC ' + element.TypeOfMac
          : 'GHG ' + element.Type
        }</th>
        <th>${element.Result
          ? element.Result
          : element.EmmisionValue
            ? element.EmmisionValue
            : 'N/A'
        }</th>
        <th>${element.MACResult ? element.MACResult : 'N/A'}</th>
        </tr>`;
    }
    //console.log('====== summryReport=====', summryReport);

    let unconditionalValue =
      graphData.targetYearEmission - graphData.unconditionaltco2;
    console.log('unconditional', unconditionalValue);
    let conditionalValue =
      graphData.targetYearEmission - graphData.conditionaltco2;

    let totalExAnthe = 0;
    let totalExPost = 0;
    let resultArray: number[] = [];

    let totalExAn = summryReport.map((e) => {
      //console.log('+++e==== eeeeee before', e.Year);
      if (e.Year >= graphData.baseYear && e.Year <= graphData.targetYear) {
        //console.log("+++++eeeeee event=====", e);
        //console.log('+++e==== before', e.Result);
        if (e.Result !== null) {
          //console.log('+++e==== after', e.Result);
          return resultArray.push(e.Result);
        }
      }
    });

    console.log('+++totalExAn====', totalExAn);

    let sumOfExAntheResults: number;
    let sumOfExPostResults: number;

    let summeryExAntheResults = resultArray.forEach((e) => {
      //console.log('=====summeryExAntheResults e======', e);
      sumOfExAntheResults = totalExAnthe += e;
      //console.log('&&&&====sumOfResults', sumOfExAntheResults);
      return sumOfExAntheResults;
    });

    let summeryExPostResults = resultArray.forEach((e) => {
      //console.log('=====sumOfExPostResults e======', e);
      sumOfExPostResults = totalExAnthe += e;
      //console.log('&&&&====sumOfExPostResults', sumOfExPostResults);
      return sumOfExPostResults;
    });

    let paragraph = `
      <div style="text-align: justify;text-justify: inter-word;">
      ${unconditionalValue
        ? `<p style="font-size:15px">Figure 1 illustrates the status of achieving emissions reduction targets
      of ${reportData.sectors} sector of ${reportData.country
        }. The expected emission
      reduction of the ${reportData.sectors} sector by ${graphData.targetYear
        } year is
      ${conditionalValue} tCO₂e conditionally, and
      ${unconditionalValue} tCO₂e unconditionally.
      Mitigation actions implemented by year ${graphData.targetYear
        } were able to reduce
      ${reportData.sectors} sector emissions from
      ${sumOfExAntheResults ? sumOfExAntheResults : 'N/A'} tCO2e.</p>`
        : `
      <p style="font-size:15px">
      Figure 1 illustrates the status of achieving emissions reduction targets
        of ${reportData.sectors} sector of ${reportData.country
        }. The expected emission
        reduction of the ${reportData.sectors} sector by ${graphData.targetYear
        } year is
        ${conditionalValue} tCO₂e. Mitigation actions
        implemented by year ${graphData.targetYear} were able to reduce
        ${reportData.sectors} sector emissions from
        ${sumOfExPostResults ? sumOfExPostResults : 'N/A'} tCO₂e.
      </p>`
      }
        
      </div>
    `;

    let userName: string;

    [userName] = this.tokenDetails.getDetails([
      TokenReqestType.username,
    ]);
    const selectedUser = await this.usersService.findByUserName(userName);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const d = new Date();
    let month = months[d.getMonth()];
    var year = d.getUTCFullYear();

    let coverPage = `
    <div style="display:flex;flex-direction:column;height:1500px;justify-content: space-around;align-items: center;background-color: #3bbbcd !important;">
            <div style="display:flex;flex-direction:column;align-items: center;justify-content: center;text-align: center">
              <h1 style="font-size: 50px;color: white">${reportData.reportName}</h1>
            </div>
            <div style="display:flex;flex-direction:column;align-items: center;justify-content: center;text-align: center">
              <h1 style="color: white">${month} ${year}</h1>
              <h3 style="color: white">${selectedUser.institution.name}</h3>
            </div>
            <div style="display:flex;flex-direction:column;align-items: center;justify-content: center;text-align: center">
              <h4 style="color: white">Prepared By</h4>
              <h4 style="color: white">${selectedUser.firstName} ${selectedUser.lastName}</h4>
            </div>
    </div>
    `

    let file = {
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
      <div><img src="http://localhost:7080/reportPDF_${datetime}.png" alt="Italian Trulli"></div>
      <div><p>Figure 1 Emissions reduction of ${reportData.sectors.toString()} sector of ${reportData.country
        }</p></div>
        <br>
      <div class="mb-5 mt-5">${tableReportContent}</div>
      <div class="mb-5 mt-5">${activitiData}</div>
      </body></html>`
    };

    await html_to_pdf.generatePdf(file, options).then((pdfBuffer: any) => {
      console.log('PDF Buffer:-', pdfBuffer);
    });

    return fileName;
  }
}
