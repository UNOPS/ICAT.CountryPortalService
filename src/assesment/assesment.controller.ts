import {
  ConsoleLogger,
  Controller,
  Get,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import e, { request } from 'express';
import { AssessmentObjective } from 'src/assessment-objective/entity/assessment-objective.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DataRequestStatus } from 'src/data-request/entity/data-request-status.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Institution } from 'src/institution/institution.entity';
import { ApplicabilityEntity } from 'src/master-data/applicability/entity/applicability.entity';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Project } from 'src/project/entity/project.entity';
import { ProjectionYear } from 'src/projection-year/entity/projection-year.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { Repository } from 'typeorm-next';
import { AssesmentService } from './assesment.service';
import { Assessment } from './entity/assesment.entity';

@Crud({
  model: {
    type: Assessment,
  },
  query: {
    join: {
      methodology: {
        eager: true,
      },
      user: {
        eager: true,
      },
      project: {
        eager: true,
      },
      ndc: {
        eager: true,
      },
      subNdc: {
        eager: true,
      },
      assessmentObjective: {
        eager: true,
      },
      assessmentYear: {
        eager: true,
      },
      parameters: {
        eager: true,
      },
      assessmentResult: {
        eager: true,
      },
      verification: {
        eager: true,
      },
    },
  },
})
@Controller('assesment')
export class AssesmentController implements CrudController<Assessment> {
  constructor(
    public service: AssesmentService,
    @InjectRepository(Parameter)
    public paramterRepo: Repository<Parameter>,
    @InjectRepository(AssessmentYear)
    public assesmentYearsRepo: Repository<AssessmentYear>,
    @InjectRepository(ProjectionYear)
    public projectionYearsRepo: Repository<ProjectionYear>,
    @InjectRepository(Project)
    public projectRepo: Repository<Project>,
    @InjectRepository(AssessmentObjective)
    public assessmentObjectiveRepo: Repository<AssessmentObjective>,
    @InjectRepository(ApplicabilityEntity)
    public applicabilityEntityRepo: Repository<ApplicabilityEntity>,
    @InjectRepository(ParameterRequest)
    public parameterRequestRepo: Repository<ParameterRequest>,
    @InjectRepository(Institution)
    public institutionRepo: Repository<Institution>,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails,
    private readonly emaiService: EmailNotificationService,

  ) { }

  get base(): CrudController<Assessment> {
    return this;
  }


  @UseGuards(JwtAuthGuard)
  @Get(
    'assessments/assessmentsinfo/:page/:limit/:filterText/:assessmentType/:isProposal/:projectId/:ctAction',
  )
  async getAssmentDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('assessmentType') assessmentType: string,
    @Query('isProposal') isProposal: number,
    @Query('projectId') projectId: number,
    @Query('ctAction') ctAction: string,
  ): Promise<any> {
    console.log("hiiiiiii")
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;


    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId, TokenReqestType.sectorId, TokenReqestType.InstitutionId])



    return await this.service.getassessmentsdetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      assessmentType,
      isProposal,
      projectId,
      ctAction,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @Get('assessments/getAssment/:id/:assementYear')
  async getAssment(
    @Request() request,
    @Query('id') id: number,
    @Query('assementYear') assementYear: string,
  ): Promise<any> {
    return await this.service.getAssessmentDetailsForQC(id, assementYear);
  }

  @Get('assessments/getassessmentData/:assementYear')
  async getassessmentData(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('assementYear') assementYear: string[],
  ): Promise<any> {
    return await this.service.getAssessmentData(
      {
        limit: limit,
        page: page,
      },
      assementYear,
    );
  }

  @Get('getAssessmentsForApproveData/:id/:assementYear/:userName')
  async getAssessmentsForApproveData(
    @Request() request,
    @Query('id') id: number,
    @Query('assementYear') assementYear: string,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.service.getAssessmentForApproveData(
      id,
      assementYear,
      userName,
    );
  }

  @Get('checkAssessmentReadyForQC/getAssment/:id')
  async checkAssessmentReadyForQC(
    @Request() request,
    @Query('assessmentId') assessmentId: number,
    @Query('assessmentYear') assessmenYear: number,
  ): Promise<any> {
    return await this.service.checkAssessmentReadyForQC(assessmentId, assessmenYear);
  }

  
  @Get('assessment/getAssessmentDetails')
  async getAssessmentDetails(
    @Request() request,
    @Query('assessmentId') assessmentId: number,
    @Query('assessmentYear') assessmenYear: string,
  ): Promise<any>{
    return await this.service.getAssessmentDetails(assessmentId,assessmenYear)
  }


  @Get('checkAssessmentReadyForCalculate/getAssment/:id')
  async checkAssessmentReadyForCalculate(
    @Request() request,
    @Query('assessmentId') assessmentId: number,
    @Query('assessmentYear') assessmenYear: number,
  ): Promise<any> {
    return await this.service.checkAssessmentReadyForCalculate(assessmentId,assessmenYear);
  }

  @Get('methologyCount')
  async methodologyCount(@Query('countryId') countryId: number): Promise<any> {
    return this.service.methodologyUseCount(countryId);
  }

  @Get('assessmentForManageDataStatus')
  async assessmentForManageDataStatus(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    // @Query('assessmentStatusName') assessmentStatusName: string,
    // @Query('Active') Active: number,
    @Query('countryId') countryId: number,
    @Query('sectorId') sectorId: number,
    @Query('isProposal') isProposal: number,

  ): Promise<any> {
    return await this.service.assessmentForManageDataStatus(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,
      // assessmentStatusName,
      // Active,
      countryId,
      sectorId,
      isProposal,

    );
  }

  @UseGuards(JwtAuthGuard)
  @Override()
  async createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Assessment,
  ): Promise<Assessment> {



    // console.log("dto",dto);
    if (dto.assessmentType != 'MAC') {
      let institution = [];
      // dto.ndc = null;
      // dto.subNdc = null;
      if (dto.user.username === undefined) {
        dto.user = null;
      }

      if (dto.mitigationActionType.id === undefined) {
        dto.mitigationActionType = null;
      }

      let proj = new Project();
      proj.id = dto.project.id;
      dto.project = proj;

      let assesment = await this.base.createOneBase(req, dto);

      let audit: AuditDto = new AuditDto();
      audit.action = dto.assessmentType + ' Assessment Created';
      audit.comment = dto.assessmentType + ' Assessment Created';
      audit.actionStatus = 'Created';

      this.auditService.create(audit);
      console.log('assesment created');

      dto.assessmentYear.map((a) => {
        let assesmenttemp = new Assessment();
        assesmenttemp.id = assesment.id;
        a.assessment = assesmenttemp;
      });

      dto.parameters.map((a) => {
        a.assessment = assesment;
      });

      dto.projectionYear &&
        dto.projectionYear.map((a) => {
          a.assessment = assesment;
        });

      dto.applicability &&
        dto.applicability.map((a) => {
          a.assessment = assesment;
        });

      try {
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        // console.log(dto.applicability);
        dto.applicability !== undefined &&
          dto.applicability.map(async (a) => {
            let years = await this.applicabilityEntityRepo.save(await a);
          });
        console.log('applicability created');
      } catch (error) {
        console.log(error);
        console.log('applicability error');
      }

      try {
        dto.assessmentYear.map(async (a) => {
          let years = await this.assesmentYearsRepo.save(await a);
        });
        console.log('assesment year created');
      } catch (error) {
        console.log(error);
        console.log('assesment year error');
      }

      let pyears = await this.projectionYearsRepo.save(
        (
          await dto
        ).projectionYear,
      );

      console.log('projection year created');
      //save parameters
      try {

        let grouped = dto.parameters.filter(i => i.isAlternative).reduce((r, v, i, a) => {
          let found = r.find(element =>
            JSON.stringify(element['parent']) === JSON.stringify(v['ParentParameter']));
          if (found == undefined) {
            r.push({
              'parent': v['ParentParameter'],
              'child': [v]
            })
          } else {
            found['child'].push(v)
            r[r.indexOf(found)] = found
          }
          return r;
        }, []);

        let par2 = await dto.parameters.filter(i => {

          let v = grouped.findIndex(element =>
            element['parent'].name == i.name &&
            element['parent'].originalName == i.originalName &&
            element['parent'].isAlternative == i.isAlternative &&
            element['parent'].isBaseline == i.isBaseline &&
            element['parent'].isProject == i.isProject &&
            element['parent'].isLekage == i.isLekage &&
            element['parent'].isProjection == i.isProjection &&
            element['parent'].vehical == i.vehical &&
            element['parent'].fuelType == i.fuelType &&
            element['parent'].route == i.route &&
            element['parent'].residue == i.residue &&
            element['parent'].soil == i.soil &&
            element['parent'].stratum == i.stratum &&
            element['parent'].feedstock == i.feedstock &&
            element['parent'].landClearance == i.landClearance &&
            element['parent'].powerPlant == i.powerPlant &&
            element['parent'].AssessmentYear == i.AssessmentYear
          );
          return !i.isAlternative && (v == -1)
        });

        // console.log('par2',par2)

        dto.parameters = [];
        await par2.map(async (a, index) => {

          if (assesment.isProposal) {
            a.institution = null;
          }
          
          if(a.value) // added for make null for default values 
          {
            a.institution = null;
          }

          a.parameterRequest = null;
          a.verificationDetail = null;
          a.isAlternative = false;
          let param = await this.paramterRepo.save(await a);
          console.log('paramter created');
          await dto.parameters.push(param);

          console.log('Save Entity');
          console.log(`${param.name} - ${param.id} - ${param.institution}`);
          


          if (a.value === null || a.value === undefined) {
            let paramReq = new ParameterRequest();
            paramReq.dataRequestStatus = DataRequestStatus.initiate;
            paramReq.parameter = param;

            await this.parameterRequestRepo.save(await paramReq);

          }

        });
        await grouped.map(async (a, index) => {
          let parent = a['parent']

          if (assesment.isProposal) {
            parent.institution = null;
          }

          parent.parameterRequest = null;
          parent.verificationDetail = null;
          parent.isAlternative = false;
          parent.assessment = assesment;
          parent.hasChild = true;
          let paramParent = await this.paramterRepo.save(await parent);
          console.log('parent paramter created');
          dto.parameters.push(paramParent);
          console.log('Save Entity');
          console.log(`${paramParent.name} - ${paramParent.id} - ${paramParent.institution}`);



          if (parent.value === null || parent.value === undefined) {
            let paramReq = new ParameterRequest();
            paramReq.dataRequestStatus = DataRequestStatus.initiate;
            paramReq.parameter = paramParent;

            await this.parameterRequestRepo.save(await paramReq);

          }

          a["child"].map(async b => {
            if (assesment.isProposal) {
              b.institution = null;
            }

            b.parameterRequest = null;
            b.verificationDetail = null;

            b.ParentParameter.id = paramParent.id;
            b.ParentParameterId = paramParent.id;


            
            //because we have to save  identify child parameter also
            b.hasChild=true



            let param = await this.paramterRepo.save(await b);
            console.log('child paramter created');
            dto.parameters.push(param);
            console.log('Save Entity');
            console.log(`${param.name} - ${param.id}`);
            console.log(`${param.name} - ${param.id} - ${param.institution}`);
            // if (!institution.includes(param.institution)) {
            //   console.log("++++++++++++", param.institution.id)
            //   await institution.push(param.institution)
            //   console.log("++++++++++++aaaaa", institution)
            // }

            if (b.value === null || b.value === undefined) {
              let paramReq = new ParameterRequest();
              paramReq.dataRequestStatus = DataRequestStatus.initiate;
              paramReq.parameter = param;

              await this.parameterRequestRepo.save(await paramReq);

            }


          })




        });

        // dto.parameters.map(async (a, index) => {
        //   if (a.ParentParameter !== null && a.ParentParameter !== undefined) {
        //     // console.log('Parameter',a)
        //     // console.log('ParentParameter',a.ParentParameter)
        //     // let parentItem = await this.paramterRepo.create(a.ParentParameter);
        //     let parentItem = dto.parameters.find(
        //       (i) =>
        //         i.name === a.ParentParameter.name &&
        //         i.isAlternative === false &&
        //         i.isBaseline === a.ParentParameter.isBaseline &&
        //         i.isLekage === a.ParentParameter.isLekage &&
        //         i.isProject === a.ParentParameter.isProject &&
        //         i.isProjection === a.ParentParameter.isProjection &&
        //         i.route === a.ParentParameter.route &&
        //         i.vehical === a.ParentParameter.vehical &&
        //         i.fuelType === a.ParentParameter.fuelType &&
        //         i.powerPlant === a.ParentParameter.powerPlant,
        //     );
        //     a.ParentParameter = new Parameter();
        //     // console.log('parentItem',parentItem);
        //     a.ParentParameter.id = parentItem.id;
        //     a.ParentParameterId = parentItem.id;
        //   } else {
        //     a.ParentParameter = null;
        //   }

        //   if (assesment.isProposal) {
        //     a.institution = null;
        //   }

        //   a.parameterRequest = null;
        //   a.verificationDetail = null;
        //   // console.log('Request Entity');
        //   // console.log(`${a.name} - ${a.id}`);

        //   let param = await this.paramterRepo.save(await a);
        //   console.log('paramter created');


        //   // let param = await this.paramterRepo.findOne({
        //   //   order: { id: 'DESC' },
        //   // });

        //   dto.parameters[index] = param;
        //   console.log('Save Entity');
        //   console.log(`${param.name} - ${param.id}`);

        //   if (a.value === null || a.value === undefined) {
        //     let paramReq = new ParameterRequest();
        //     paramReq.dataRequestStatus = DataRequestStatus.initiate;
        //     paramReq.parameter = param;

        //     await this.parameterRequestRepo.save(await paramReq);
        //     console.log('Param Request created');
        //   }
        // });


      } catch (error) {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log(error);
      }

      if (dto.assessmentObjective) {
        console.log("objective dto..", dto.assessmentObjective);
        dto.assessmentObjective.map(async (a) => {
          if (a.id === 0) {
            console.log('xxxxxxxxxxxxxx');
            a.assessmentId = assesment.id;
            a.status = 0;
            await this.assessmentObjectiveRepo.save(await a);
            console.log('Assessment created');
          } else {
            a.id = null;
            a.assessmentId = assesment.id;
            await this.assessmentObjectiveRepo.save(await a);
            console.log('Assessment created else');
          }
        });
      }

      //update project
      if (!dto.isProposal) {
        if (dto.ndc && dto.ndc.id !== dto.project.ndc?.id) {
          dto.project.ndc = dto.ndc;
        }
        if (dto.subNdc && dto.subNdc.id !== dto.project.subNdc?.id) {
          dto.project.subNdc = dto.subNdc;
        }
        if (dto.projectDuration !== dto.project.duration) {
          dto.project.duration = dto.projectDuration;
        }
        if (dto.projectStartDate !== dto.project.proposeDateofCommence) {
          dto.project.proposeDateofCommence = dto.projectStartDate;
        }

        await this.projectRepo.save((await dto).project);
        console.log('Project created');
      }

      let pro= assesment.project.id;
     let pr= await this.projectRepo.findOne({where:{id:pro} ,relations:['country']},)
      let con =pr.country;
      let sec = pr.sector;
      let ins = await this.institutionRepo.findOne({ where: { country: con, sector: sec, type: 5 } });
           let template='Dear ' +
      ins.name + ' ' +
      ' <br/> New Data request ' +
      '<br/> Data request with following information has shared with you.'+
      '<br/> project name -: ' + assesment.project.climateActionName ;
      // '<br/> value -:' + dataRequestItem.parameter.value +

      this.emaiService.sendMail(
        ins.email,
        'New Data request',
        '',
        template,
      );

      return assesment;
    }
    else {
      //console.log("came to inside");
      let institution =[];
      dto.ndc = null;
      dto.subNdc = null;
      dto.user = null;
      dto.applicability = null;
      dto.methodology = null;
      dto.mitigationActionType = null;
      // console.log("passed null rows");

      let proj = new Project();
      proj.id = dto.project.id;
      dto.project = proj;

      let assesment = await this.base.createOneBase(req, dto);
      // console.log("assessmemt created",assesment);
      let audit: AuditDto = new AuditDto();
      audit.action = dto.assessmentType + ' Assessment Created';
      audit.comment = dto.assessmentType + ' Assessment Created';
      audit.actionStatus = 'Created';

      this.auditService.create(audit);
      console.log('assesment created');
      dto.assessmentYear.map((a) => {
        a.assessment = assesment;
      });

      dto.assessmentObjective.map((a) => {
        a.assessmentId = assesment.id;
      });

      dto.parameters.map((a) => {
        a.assessment = assesment;
      });

      let years = await this.assesmentYearsRepo.save(
        (
          await dto
        ).assessmentYear,
      );

      let objectives = await this.assessmentObjectiveRepo.save(
        (
          await dto
        ).assessmentObjective,
      );
      // let objectives = await this.assessmentObjectiveRepo.save(
      //   (
      //     await dto
      //   ).assessmentObjective,
      // );
      // console.log("assessmemtYear created");

      //save parameters

      try {
        let grouped = dto.parameters.filter(i=>i.isAlternative).reduce((r, v, i, a) => {
          let  found = r.find(element => 
            JSON.stringify(element['parent']) === JSON.stringify(v['ParentParameter']) );
           
           if (found== undefined) {
               r.push({'parent':v['ParentParameter'],
                        'child':[v]
               })
           } else {
               found['child'].push(v)
               r[r.indexOf(found)]=found
           }
           return r;
       }, []);
    
       let par2= dto.parameters.filter(i=>{
            
           let v=grouped.findIndex(element => 
             element['parent'].name == i.name  &&
             element['parent'].originalName == i.originalName  &&
             element['parent'].isAlternative == i.isAlternative  &&
             element['parent'].isBaseline == i. isBaseline &&
             element['parent'].isProject == i.isProject  &&
             element['parent'].isLekage == i.isLekage  &&
             element['parent'].isProjection == i.isProjection  &&
             element['parent'].vehical == i.vehical  &&
             element['parent'].fuelType == i.fuelType  &&
             element['parent'].route == i.route  &&
             element['parent'].residue == i.residue &&
            element['parent'].soil == i.soil &&
            element['parent'].stratum == i.stratum &&
            element['parent'].feedstock == i.feedstock &&
            element['parent'].landClearance == i.landClearance &&
            element['parent'].powerPlant == i.powerPlant &&
             
             element['parent'].AssessmentYear == i. AssessmentYear 
                );
           return !i.isAlternative && (v == -1) } );
   
           // console.log('par2',par2)
   
           dto.parameters=[];
           par2.map(async (a, index) => {
           
             if (assesment.isProposal) {
               a.institution = null;
             }
   
             a.parameterRequest = null;
             a.verificationDetail = null;
              a.isAlternative=false;
             let param = await this.paramterRepo.save(await a);
             console.log('paramter created');
             dto.parameters.push(param) ;
            
             console.log('Save Entity');
             console.log(`${param.name} - ${param.id}`);
   
             if (a.value === null || a.value === undefined) {
               let paramReq = new ParameterRequest();
               paramReq.dataRequestStatus = DataRequestStatus.initiate;
               paramReq.parameter = param;
   
               await this.parameterRequestRepo.save(await paramReq);
               
             }
           
           });
           grouped.map(async (a, index) => {
             let parent=a['parent']
   
             if (assesment.isProposal) {
               parent.institution = null;
             }
   
             parent.parameterRequest = null;
             parent.verificationDetail = null;
             parent.isAlternative=false;
             parent.hasChild = true;
             parent.assessment=assesment;
             let paramParent = await this.paramterRepo.save(await parent);
             console.log('parent paramter created');
             dto.parameters.push(paramParent) ;
             console.log('Save Entity');
             console.log(`${paramParent.name} - ${paramParent.id}`);
   
             if (parent.value === null || parent.value === undefined) {
               let paramReq = new ParameterRequest();
               paramReq.dataRequestStatus = DataRequestStatus.initiate;
               paramReq.parameter = paramParent;
   
               await this.parameterRequestRepo.save(await paramReq);
               
             }
   
             a["child"].map(async b=>{
               if (assesment.isProposal) {
                 b.institution = null;
               }
     
               b.parameterRequest = null;
               b.verificationDetail = null;
               
               b.ParentParameter.id = paramParent.id;
               b.ParentParameterId = paramParent.id;
   
   
               let param = await this.paramterRepo.save(await b);
               console.log('child paramter created');
               dto.parameters.push(param);
               console.log('Save Entity');
               console.log(`${param.name} - ${param.id}`);
     
               if (b.value === null || b.value === undefined) {
                 let paramReq = new ParameterRequest();
                 paramReq.dataRequestStatus = DataRequestStatus.initiate;
                 paramReq.parameter = param;
     
                 await this.parameterRequestRepo.save(await paramReq);
                
               }
   
   
             })
   
   
             
           
           });



        // dto.parameters.map(async (a, index) => {
        //   if (a.ParentParameter !== null && a.ParentParameter !== undefined) {
        //     let parentItem = dto.parameters.find(
        //       (i) =>
        //         i.name === a.ParentParameter.name &&
        //         i.value === a.ParentParameter.value &&
        //         i.institution === a.ParentParameter.institution &&
        //         i.uomDataEntry === a.ParentParameter.uomDataEntry &&
        //         i.uomDataRequest === a.ParentParameter.uomDataRequest &&
        //         //  i.assessment === a.ParentParameter.assessment &&
        //         // i.isAlternative === false &&
        //         i.isBaseline === a.ParentParameter.isBaseline &&
        //         i.isLekage === a.ParentParameter.isLekage &&
        //         i.isProject === a.ParentParameter.isProject &&
        //         i.isProjection === a.ParentParameter.isProjection &&
        //         // i.route === a.ParentParameter.route &&
        //         //i.vehical === a.ParentParameter.vehical &&
        //         // i.fuelType === a.ParentParameter.fuelType &&
        //         // i.powerPlant === a.ParentParameter.powerPlant,
        //         i.AssessmentYear === a.ParentParameter.AssessmentYear,
        //     );
        //     // console.log('1 parentItem.id..',parentItem.id)
        //     a.ParentParameter = new Parameter();
        //     a.ParentParameter.id = parentItem?.id;
        //     a.ParentParameterId = parentItem?.id;
        //   } else {
        //     a.ParentParameter = null;
        //     // console.log('a.ParentParameter = null wela')
        //   }

        //   if (assesment.isProposal) {
        //     a.institution = null;
        //   }

        //   a.parameterRequest = null;
        //   a.verificationDetail = null;

        //   let param = await this.paramterRepo.save(await a);
        //   dto.parameters[index] = param;
        //   console.log('Save Entity');
        //   // console.log(`${param.name} - ${param.id}`);
        //   // console.log(param);
        //   if (a.value === null || a.value === undefined) {
        //     let paramReq = new ParameterRequest();
        //     paramReq.dataRequestStatus = DataRequestStatus?.initiate;
        //     paramReq.parameter = param;

        //     await this.parameterRequestRepo.save(await paramReq);
        //     console.log('Param Request created');
        //   }
        // });
      } catch (error) {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log(error);
      }

      // if (dto.assessmentObjective) {
      //   dto.assessmentObjective.map(async (a) => {
      //     if (a.id === 0) {
      //       console.log('xxxxxxxxxxxxxx');
      //       a.assessmentId = assesment.id;
      //       a.status = 0;
      //       await this.assessmentObjectiveRepo.save(await a);
      //       console.log('Assessment created');
      //     } else {
      //       await this.assessmentObjectiveRepo.save(await a);
      //       console.log('Assessment created');
      //     }
      //   });
      // }

      //update project
      //  if (!dto.isProposal) {
      //   if (dto.ndc.id !== dto.project.ndc?.id) {
      //     dto.project.ndc = dto.ndc;
      //   }
      //   if (dto.subNdc.id !== dto.project.subNdc?.id) {
      //     dto.project.subNdc = dto.subNdc;
      //   }
      //   if (dto.projectDuration !== dto.project.duration) {
      //     dto.project.duration = dto.projectDuration;
      //   }
      //   if (dto.projectStartDate !== dto.project.proposeDateofCommence) {
      //     dto.project.proposeDateofCommence = dto.projectStartDate;
      //   }

      //   await this.projectRepo.save((await dto).project);
      //   console.log('Project created');
      // }


      let pro= assesment.project.id;
      let pr= await this.projectRepo.findOne({where:{id:pro} ,relations:['country']},)
       let con =pr.country;
       let sec = pr.sector;
      let ins = await this.institutionRepo.findOne({ where: { country: con, sector: sec, type: 5 } });

      let template='Dear ' +
      ins.name + ' ' +
      ' <br/> Data request with following information has shared with you.' +
      '<br/> project name -: ' + assesment.project.climateActionName 
      ;

      this.emaiService.sendMail(
        ins.email,
        'Pass QC',
        '',
        template,
      );

      return assesment;
    }
  }


  @Get('assessments/byprojectId/:id')
  async getAssessmentsBYProjectId(
    @Request() request,
    @Query('id') id: number,

  ): Promise<any> {
    return await this.service.getAssessmentsBYProjectId(id);
  }



  @Get('methodologyName/byassessmntId/:id')
  async getMethodologyNameByAssessmentId(
    @Request() request,
    @Query('id') id: number,

  ): Promise<any> {
    return await this.service.getMethodologyNameByAssessmentId(id);
  }

}
