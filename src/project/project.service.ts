import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Project } from './entity/project.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Sector } from 'src/master-data/sector/sector.entity';
import { MitigationActionType } from 'src/master-data/mitigation-action/mitigation-action.entity';
import { ProjectStatus } from 'src/master-data/project-status/project-status.entity';
import { ProjectApprovalStatus } from 'src/master-data/project-approval-status/project-approval-status.entity';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { SubNdc } from 'src/master-data/ndc/sub-ndc.entity';
import { AssessmentResault } from 'src/assesment-resault/entity/assessment-resault.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Country } from 'src/country/entity/country.entity';
import { Institution } from 'src/institution/institution.entity';
import { REQUEST } from '@nestjs/core';
import { ProjectOwner } from 'src/master-data/project-owner/projeect-owner.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';

@Injectable()
export class ProjectService extends TypeOrmCrudService<Project> {
  constructor(@InjectRepository(Project) repo,
    private readonly emaiService: EmailNotificationService,
  ) {

    super(repo);
  }

  async getProjectDetails(
    options: IPaginationOptions,
    filterText: string,
    sectorId: number,
    statusId: number,
    mitigationActionTypeId: number,
    editedOn: string,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionIdFromTocken: number
  ): Promise<Pagination<Project>> {
    let filter: string = '';
    // let fDate = `${editedOn.getFullYear()}-${editedOn.getMonth()+1}-${editedOn.getDate()}`;

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        // '(dr.climateActionName LIKE :filterText OR dr.description LIKE :filterText)';
        '(dr.climateActionName LIKE :filterText OR dr.contactPersoFullName LIKE :filterText OR sec.name LIKE :filterText OR mit.name LIKE :filterText OR pst.name LIKE :filterText OR dr.editedOn LIKE :filterText)';
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      // console.log('sectorIdFromTocken')
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `dr.sectorId = :sectorIdFromTocken`;
      }
    } else if (institutionIdFromTocken) {
      if (filter) {
        filter = `${filter}  and dr.mappedInstitutionId = :institutionIdFromTocken`;
      } else {
        filter = `dr.mappedInstitutionId = :institutionIdFromTocken`;
      }

    }

    else {

      if (sectorId != 0) {

        if (filter) {
          // console.log('sectorId1',sectorId)
          filter = `${filter}  and dr.sectorId = :sectorId`;
        } else {
          // console.log('sectorId2',sectorId)
          filter = `dr.sectorId = :sectorId`;
        }
      }


    }

    // if (sectorId != 0) {
    //   if (filter) {
    //     filter = `${filter}  and dr.sectorId = :sectorId`;
    //   } else {
    //     filter = `dr.sectorId = :sectorId`;
    //   }
    // }

    if (statusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :statusId`;
      } else {
        filter = `dr.projectStatusId = :statusId`;
      }
    }

    if (mitigationActionTypeId != 0) {
      if (filter) {
        filter = `${filter}  and dr.mitigationActionTypeId = :mitigationActionTypeId`;
      } else {
        filter = `dr.mitigationActionTypeId = :mitigationActionTypeId`;
      }
    }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne('dr.sector', Sector, 'sec', 'sec.id = dr.sectorId')
      .leftJoinAndMapOne('dr.country', Country, 'cou', 'cou.id = dr.countryId')
      .leftJoinAndMapOne('dr.institution', Institution, 'ins', 'dr.mappedInstitutionId = ins.id')
      .leftJoinAndMapOne(
        'dr.mitigationAction',
        MitigationActionType,
        'mit',
        'mit.id = dr.mitigationActionTypeId',
      )
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'past',
        'dr.projectApprovalStatusId = past.id',
      )
      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {
        filterText: `%${filterText}%`,
        mitigationActionTypeId,
        sectorId,
        statusId,
        editedOn,
        countryIdFromTocken,
        sectorIdFromTocken,
        institutionIdFromTocken
      })
      .orderBy('dr.createdOn', 'DESC');
    // console.log(
    //   '=====================================================================',
    // );
    // console.log(data.getQuery());

    let resualt = await paginate(data, options);
    console.log("resualt..", resualt);
    if (resualt) {
      return resualt;
    }
  }

  async mail(dto: Project) {

    console.log('mail-----------------',dto)
    let template =
      'Dear ' + dto.contactPersoFullName + ' ' +
      ' <br/> Your project successfully Submitted .' +
      '<br/> Project name -: ' + dto.climateActionName+'<br/>'+'<br/> Thank you';

    this.emaiService.sendMail(
      dto.email,
      'Project Submitted',
      '',
      template,
    );
  }

  async getactiveClimateActionDetails(
    options: IPaginationOptions,
    countryId: number,
    sectorId: number,
    ndcId: number,
    subndcId: number,
    projectApprovalStatusId: number,

  ): Promise<Pagination<any>> {
    let filter: string = '';



    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorId`;
      } else {
        filter = `dr.sectorId = :sectorId`;
      }
    }
    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }
    if (ndcId != 0) {
      if (filter) {
        filter = `${filter}  and dr.ndcId = :ndcId`;
      } else {
        filter = `dr.ndcId = :ndcId`;
      }
    }

    if (subndcId != 0) {
      if (filter) {
        filter = `${filter}  and dr.subNdcId = :subndcId`;
      } else {
        filter = `dr.subNdcId = :subndcId`;
      }
    }
    if (countryId != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryId`;
      } else {
        filter = `dr.countryId = :countryId`;
      }
    }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne('dr.sector', Sector, 'sec', 'sec.id = dr.sectorId')
      .leftJoinAndMapOne('dr.ndc', Ndc, 'ndc', 'ndc.id = dr.ndcId')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapMany('dr.subNdc', SubNdc, 'sub', 'sub.id = dr.subNdcId')

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {

        sectorId,
        ndcId,
        subndcId,
        countryId,
        projectApprovalStatusId,
      })
      .orderBy('dr.id', 'ASC');

    console.log(
      '=====================================================================',
    );
    //console.log(data.getQuery());

    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }




  async getAllProjectDetails(
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
    assessmentStatusName: string,
    Active: number,
    countryId: number,
    sectorId: number,
  ): Promise<Pagination<Project>> {

    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.climateActionName LIKE :filterText OR asse.assessmentType LIKE :filterText OR para.AssessmentYear LIKE :filterText OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
    }

    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :projectStatusId`;
      } else {
        filter = `dr.projectStatusId = :projectStatusId`;
      }
    }

    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }

    if (assessmentStatusName != null && assessmentStatusName != undefined && assessmentStatusName != '') {
      if (filter) {
        filter = `${filter}  and asse.assessmentStage = :assessmentStatusName`;
      } else {
        filter = `asse.assessmentStage = :assessmentStatusName`;
      }
    }


    // if active = 0 ---> whole climateactions list
    // if active = 1 ---> all climate actions
    // if active = 2 ---> active climate actions

    if (Active == 1) {
      // console.log(Active);
      if (filter) {
        filter = `${filter}  and pas.id != 4 `; // no proposed CA s all climate
      } else {
        filter = `pas.id != 4`;
      }
    }
    else if (Active == 2) {
      //console.log(Active);
      if (filter) {
        filter = `${filter}  and pas.id = 5 `; // only active CA s
      } else {
        filter = `pas.id = 5 `;
      }

    }




    if (countryId != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryId`;
      } else {
        filter = `dr.countryId = :countryId`;
      }
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorId`;
      } else {
        filter = `dr.sectorId = :sectorId`;
      }
    }




    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'pas',
        'pas.id = dr.projectApprovalStatusId',
      )
      .leftJoinAndMapMany(
        'dr.assessement',
        Assessment,
        'asse',
        'asse.projectId = dr.id',
      )
      // .leftJoinAndMapMany(
      //   'asse.parameter',
      //   Parameter,
      //   'para',
      //   'para.assessmentId = asse.id',
      // )


      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {
        filterText: `%${filterText}%`,
        projectStatusId,
        projectApprovalStatusId,
        assessmentStatusName,
        Active,
        countryId,
        sectorId,
      })
      .orderBy('dr.createdOn', 'ASC');
    // console.log(
    //   '=====================================================================',
    // );
    // console.log(data.getQuery());

    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }


  async getAllProjectDetailsmanagedatastatus(
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
    assessmentStatusName: string,
    Active: number,
    countryId: number,
    sectorId: number,

  ): Promise<Pagination<Project>> {

    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        // '(dr.climateActionName LIKE :filterText OR asse.assessmentType LIKE :filterText OR para.AssessmentYear LIKE :filterText OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
        '(dr.climateActionName LIKE :filterText OR asse.assessmentType LIKE :filterText OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';

    }

    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :projectStatusId`;
      } else {
        filter = `dr.projectStatusId = :projectStatusId`;
      }
    }

    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }

    if (
      assessmentStatusName != null &&
      assessmentStatusName != undefined &&
      assessmentStatusName != ''
    ) {
      if (filter) {
        filter = `${filter}  and asse.assessmentStage = :assessmentStatusName`;
      } else {
        filter = `asse.assessmentStage = :assessmentStatusName`;
      }
    }

    // if active = 0 ---> whole climateactions list
    // if active = 1 ---> all climate actions
    // if active = 2 ---> active climate actions

    if (Active == 1) {
      // console.log(Active);
      if (filter) {
        filter = `${filter}  and pas.id != 4 `; // no proposed CA s all climate
      } else {
        filter = `pas.id != 4`;
      }
    } else if (Active == 2) {
      //console.log(Active);
      if (filter) {
        filter = `${filter}  and pas.id = 5 `; // only active CA s
      } else {
        filter = `pas.id = 5 `;
      }
    }

    if (countryId != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryId`;
      } else {
        filter = `dr.countryId = :countryId`;
      }
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorId`;
      } else {
        filter = `dr.sectorId = :sectorId`;
      }
    }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'pas',
        'pas.id = dr.projectApprovalStatusId',
      )
      .leftJoinAndMapMany(
        'dr.assessement',
        Assessment,
        'asse',
        'asse.projectId = dr.id',
      )
      /* 
        .leftJoinAndMapMany(
          'asse.parameter',
          Parameter,
          'para',
          'para.assessmentId = asse.id',
        )
       */

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {
        filterText: `%${filterText}%`,
        projectStatusId,
        projectApprovalStatusId,
        assessmentStatusName,
        Active,
        countryId,
        sectorId,
      })
      .orderBy('dr.createdOn', 'ASC');

    console.log(
      '=====================================================================',
    );
    //console.log(data.getQuery());

    let resualt = await paginate(data, options);
    //console.log('my result...',resualt)
    if (resualt) {
      //  console.log("results for manage..",resualt)
      return resualt;
    }
  }

  async getProjectList(
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
    assessmentStatusName: string,
    Active: number,
    // countryId: number,
    sectorId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Pagination<Project>> {
    // console.log("hiii...")
    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.climateActionName LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.institution LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
    }




    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      // console.log('sectorIdFromTocken')
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `dr.sectorId = :sectorIdFromTocken`;
      }
    } else {

      if (sectorId != 0) {

        if (filter) {
          // console.log('sectorId1',sectorId)
          filter = `${filter}  and dr.sectorId = :sectorId `;
        } else {
          // console.log('sectorId2',sectorId)
          filter = `dr.sectorId = :sectorId `;
        }
      }
    }

    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :projectStatusId`;
      } else {
        filter = `dr.projectStatusId = :projectStatusId`;
      }
    }

    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }

    if (
      assessmentStatusName != null &&
      assessmentStatusName != undefined &&
      assessmentStatusName != ''
    ) {
      if (filter) {
        filter = `${filter}  and asse.assessmentStage = :assessmentStatusName`;
      } else {
        filter = `asse.assessmentStage = :assessmentStatusName`;
      }
    }

    // if active = 0 ---> whole climateactions list
    // if active = 1 ---> all climate actions
    // if active = 2 ---> active climate actions

    if (Active == 1) {
      // console.log(Active);
      if (filter) {
        filter = `${filter}  and pas.id != 4 `; // no proposed CA s all climate
      } else {
        filter = `pas.id != 4`;
      }
    } else if (Active == 2) {
      //console.log(Active);
      if (filter) {
        filter = `${filter}  and pas.id = 5 `; // only active CA s
      } else {
        filter = `pas.id = 5 `;
      }
    }

    // if (countryId != 0) {
    //   if (filter) {
    //     filter = `${filter}  and dr.countryId = :countryId`;
    //   } else {
    //     filter = `dr.countryId = :countryId`;
    //   }
    // }

    // if (sectorId != 0) {
    //   if (filter) {
    //     filter = `${filter}  and dr.sectorId = :sectorId`;
    //   } else {
    //     filter = `dr.sectorId = :sectorId`;
    //   }
    // }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'pas',
        'pas.id = dr.projectApprovalStatusId',
      )
      .leftJoinAndMapOne(
        'dr.country',
        Country,
        'cou',
        'dr.countryId = cou.id',
      )
      .leftJoinAndMapOne(
        'dr.NDC',
        Ndc,
        'nc',
        'dr.ndcId = nc.id',
      )
      .leftJoinAndMapOne(
        'dr.subNDC',
        SubNdc,
        'subnc',
        'dr.subNdcId = subnc.id',
      )
      .leftJoinAndMapOne(
        'dr.projectOwer',
        ProjectOwner,
        'pro',
        'dr.projectOwnerId = pro.id',
      )
      .leftJoinAndMapOne(
        'dr.sector',
        Sector,
        'sct',
        'dr.sectorId = sct.id',
      )

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {
        filterText: `%${filterText}%`,
        projectStatusId,
        projectApprovalStatusId,
        assessmentStatusName,
        Active,
        // countryId,
        sectorId,
        countryIdFromTocken,
        sectorIdFromTocken
      })
      .orderBy('dr.createdOn', 'DESC');
    // console.log(
    //   '=====================================================================',
    // );
    // console.log(data.getQuery());

    let resualt = await paginate(data, options);

    if (resualt) {
      //console.log("my result....");
      //console.log(resualt.items);
      //console.log(resualt.items.length);
      return resualt;
    }
  }

  async getDateRequest(
    options: IPaginationOptions,
    filterText: string,
  ): Promise<Pagination<any>> {
    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.climateActionName LIKE :filterText  OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
    }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany('dr', Assessment, 'a', 'a.projectId = dr.id')
      .leftJoinAndMapMany(
        'a',
        AssessmentResault,
        'assre',
        'assre.assementId = a.id',
      )
      .leftJoinAndMapMany('a', Parameter, 'p', 'p.assessmentId = a.id')
      .leftJoinAndMapMany('p', ParameterRequest, 'pr', 'pr.ParameterId = p.id')
      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {
        filterText: `%${filterText}%`,
      })
      .orderBy('dr.createdOn', 'DESC');
    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }














  // All climate action
  async getAllCAList(
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
    assessmentStatusName: string,
    // countryId: number,
    sectorId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Pagination<Project>> {
    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        // '(dr.climateActionName LIKE :filterText OR asse.assessmentType LIKE :filterText  OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
        '(dr.climateActionName LIKE :filterText  OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';


    }


    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      // console.log('sectorIdFromTocken')
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `dr.sectorId = :sectorIdFromTocken`;
      }
    } else {

      if (sectorId != 0) {

        if (filter) {
          // console.log('sectorId1',sectorId)
          filter = `${filter}  and dr.sectorId = :sectorId`;
        } else {
          // console.log('sectorId2',sectorId)
          filter = `dr.sectorId = :sectorId`;
        }
      }


    }




    // console.log("hello");
    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :projectStatusId`;
      } else {
        filter = `dr.projectStatusId = :projectStatusId`;
      }
    }

    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }




    if (filter) {
      filter = `${filter}  and pas.id !=4 `; // no projects that belong to propose status
    } else {
      filter = `pas.id !=4`;
    }



    // if (countryId != 0) {
    //   if (filter) {
    //     filter = `${filter}  and dr.countryId = :countryId`;
    //   } else {
    //     filter = `dr.countryId = :countryId`;
    //   }
    // }

    // if (sectorId != 0) {
    //   if (filter) {
    //     filter = `${filter}  and dr.sectorId = :sectorId`;
    //   } else {
    //     filter = `dr.sectorId = :sectorId`;
    //   }
    // }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'pas',
        'pas.id = dr.projectApprovalStatusId',
      )
      // .leftJoinAndMapMany(
      //   'dr.assessement',
      //   Assessment,
      //   'asse',
      //   'asse.projectId = dr.id',
      // )

      .where(filter, {
        filterText: `%${filterText}%`,
        projectStatusId,
        projectApprovalStatusId,
        assessmentStatusName,
        // countryId,
        sectorId,
        countryIdFromTocken, sectorIdFromTocken
      })
      .orderBy('dr.createdOn', 'ASC');



    console.log(
      '=====================================================================',
    );
    //console.log(data.getQuery());

    let result = await paginate(data, options);
    // console.log("all CA results..",result);
    if (result) {
      return result;
    }
  }



  // Active climate actions
  async getActCAList(
    options: IPaginationOptions,
    filterText: string,

    projectApprovalStatusId: number,
    isProposal: number,
    // countryId: number,
    sectorId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    asseType: string,
  ): Promise<Pagination<Project>> {

    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.climateActionName LIKE :filterText OR asse.assessmentType LIKE :filterText OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      // console.log('sectorIdFromTocken')
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `dr.sectorId = :sectorIdFromTocken`;
      }
    } else {

      if (sectorId != 0) {

        if (filter) {
          // console.log('sectorId1',sectorId)
          filter = `${filter}  and dr.sectorId = :sectorId`;
        } else {
          // console.log('sectorId2',sectorId)
          filter = `dr.sectorId = :sectorId`;
        }
      }


    }





    console.log("asse tupe,...", asseType)

    if (asseType != '') {
      if (filter) {
        filter = `${filter}  and asse.assessmentType = :asseType`;
      } else {
        filter = `asse.assessmentType = :asseType`;
      }
    }

    // find active projects which have done proprose assements and active assessments
    if (isProposal != -1) {
      if (filter) {
        filter = `${filter}  and asse.isProposal = :isProposal`;
      } else {
        filter = `asse.isProposal = :isProposal`;
      }
    }

    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }





    if (filter) {
      filter = `${filter}  and pas.id = 5 `; // only active climate actions
    } else {
      filter = `pas.id = 5`;
    }



    // if (countryId != 0) {
    //   if (filter) {
    //     filter = `${filter}  and dr.countryId = :countryId`;
    //   } else {
    //     filter = `dr.countryId = :countryId`;
    //   }
    // }

    // if (sectorId != 0) {
    //   if (filter) {
    //     filter = `${filter}  and dr.sectorId = :sectorId`;
    //   } else {
    //     filter = `dr.sectorId = :sectorId`;
    //   }
    // }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'pas',
        'pas.id = dr.projectApprovalStatusId',
      )
      .leftJoinAndMapMany(
        'dr.assessement',
        Assessment,
        'asse',
        'asse.projectId = dr.id',
      )


      .where(filter, {
        filterText: `%${filterText}%`,
        asseType,
        projectApprovalStatusId,
        isProposal,
        // countryId,
        sectorId,
        countryIdFromTocken,
        sectorIdFromTocken
      })
      .orderBy('dr.createdOn', 'ASC')
      .groupBy('dr.id');



    console.log(
      '=====================================================================',
    );
    // console.log(data.getQuery());

    let result = await paginate(data, options);
    console.log("results..", result);
    if (result) {
      return result;
    }
  }

  async getProjectsForCountryAndSectorAdmins(options: IPaginationOptions,
    sectorId: number,
    projectApprovalStatus: number[],
    ndcId: number,
    subNdcId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionIdFromTocken: number
  ): Promise<Pagination<Project>> {


    let filter: string = '';

    // console.log("context",sectorIdFromTocken)
    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      // console.log('sectorIdFromTocken')
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorIdFromTocken  `;
      } else {
        filter = `dr.sectorId = :sectorIdFromTocken`;
      }
    }
    // else if(institutionIdFromTocken){
    //   if (filter) {
    //     filter = `${filter}  and dr.mappedInstitutionId = :institutionIdFromTocken`;
    //   } else {
    //     filter = `dr.mappedInstitutionId = :institutionIdFromTocken`; 
    // }

    //}
    else {

      if (sectorId != 0) {

        if (filter) {
          // console.log('sectorId1',sectorId)
          filter = `${filter}  and dr.sectorId = :sectorId`;
        } else {
          // console.log('sectorId2',sectorId)
          filter = `dr.sectorId = :sectorId`;
        }
      }


    }


    if (projectApprovalStatus && projectApprovalStatus.length > 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId IN (:...projectApprovalStatus)`;
      } else {
        filter = `dr.projectApprovalStatusId IN  (:...projectApprovalStatus)`;
      }
    }
    if (ndcId != 0) {
      if (filter) {
        filter = `${filter}  and dr.ndcId = :ndcId`;
      } else {
        filter = `dr.ndcId = :ndcId`;
      }
    }
    if (subNdcId != 0) {
      if (filter) {
        filter = `${filter}  and dr.subNdcId = :subNdcId`;
      } else {
        filter = `dr.subNdcId = :subNdcId`;
      }
    }


    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany(
        'dr.assessments',
        Assessment,
        'asse',
        'asse.projectId = dr.id',
      )
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .select([

        'dr.climateActionName',
        'asse.id',
        'pst.id',
        'dr.id'

      ])
      .where(filter, {
        countryIdFromTocken,
        sectorIdFromTocken,
        sectorId,
        institutionIdFromTocken,
        projectApprovalStatus,
        ndcId, subNdcId
      })
      .orderBy('dr.createdOn', 'ASC')
      .groupBy('dr.id');

    let result = await paginate(data, options);

    if (result) {
      console.log("resul===============================", result);
      return result;
    }

  }

  async getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(options: IPaginationOptions,
    sectorId: number,
    projectApprovalStatus: number[],
    ndcId: number,
    subNdcId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionIdFromTocken: number
  ): Promise<Pagination<Project>> {


    let filter: string = '';

    // console.log("context",sectorIdFromTocken)
    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      // console.log('sectorIdFromTocken')
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorIdFromTocken  `;
      } else {
        filter = `dr.sectorId = :sectorIdFromTocken`;
      }
    }
    else if (institutionIdFromTocken) {
      if (filter) {
        filter = `${filter}  and dr.mappedInstitutionId = :institutionIdFromTocken`;
      } else {
        filter = `dr.mappedInstitutionId = :institutionIdFromTocken`;
      }

    }
    else {

      if (sectorId != 0) {

        if (filter) {
          // console.log('sectorId1',sectorId)
          filter = `${filter}  and dr.sectorId = :sectorId`;
        } else {
          // console.log('sectorId2',sectorId)
          filter = `dr.sectorId = :sectorId`;
        }
      }


    }


    if (projectApprovalStatus && projectApprovalStatus.length > 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId IN (:...projectApprovalStatus)`;
      } else {
        filter = `dr.projectApprovalStatusId IN  (:...projectApprovalStatus)`;
      }
    }
    if (ndcId != 0) {
      if (filter) {
        filter = `${filter}  and dr.ndcId = :ndcId`;
      } else {
        filter = `dr.ndcId = :ndcId`;
      }
    }
    if (subNdcId != 0) {
      if (filter) {
        filter = `${filter}  and dr.subNdcId = :subNdcId`;
      } else {
        filter = `dr.subNdcId = :subNdcId`;
      }
    }


    let data = this.repo
      .createQueryBuilder('dr')

      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .select([

        'dr.climateActionName',
        'dr.proposeDateofCommence',
        'pst.id',
        'pst.name',
        'dr.id',


      ])
      .where(filter, {
        countryIdFromTocken,
        sectorIdFromTocken,
        sectorId,
        institutionIdFromTocken,
        projectApprovalStatus,
        ndcId, subNdcId
      })
      .orderBy('dr.createdOn', 'ASC');

    let result = await paginate(data, options);

    if (result) {
      // console.log("resu",result);
      return result;
    }

  }




  async getTProjectById(

    id: number,
  ): Promise<Project> {

    let data = this.repo
      .createQueryBuilder('pr')
      .leftJoinAndMapOne(
        'pr.status',
        ProjectStatus,
        'ps',
        'pr.projectStatusId = ps.id',
      )
      .where('pr.id = ' + id);

    let result = await data.getOne();

    return result;
  }




  // Track climate actions
  async getTrackClimateActionsDetails(
    options: IPaginationOptions,
    filterText: string,
    year: string,
    selectedNdcIds: string,
    countryIdFromTocken: number

  ): Promise<Pagination<Project>> {

    let filter: string = '';



    let ndcIDArry: Number[] = selectedNdcIds.split(',').map(Number);

    // let ndcIDArry = selectedNdcIds.split(",")
    console.log("filterText..", filterText)
    console.log("year..", year);
    console.log("final id ..", ndcIDArry);


    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }


    // find active projects which have done proprose assements and active assessments

    // if (projectApprovalStatusId != 0) {
    //   if (filter) {
    //     filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
    //   } else {
    //     filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
    //   }
    // }

    if (year != null) {

      if (filter) {
        filter = `${filter}  and asseYear.assessmentYear = :year `;
      } else {
        filter = `asseYear.assessmentYear = :year`;
      }
    }

    if (selectedNdcIds != '') {
      if (filter) {
        filter = `${filter}  and nd.id in(` + ndcIDArry.toString() + `) `;
        //filter = `${filter}  and nd.id in("+x.toStirng()+") `; 
      } else {
        filter = `nd.id in(` + ndcIDArry.toString() + `)`;
      }
    }













    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany(
        'dr.assessment',
        Assessment,
        'asse',
        'asse.projectId = dr.id',
      )
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'ps',
        'dr.projectStatusId = ps.id',
      )
      .leftJoinAndMapOne(
        'dr.ndc',
        Ndc,
        'nd',
        'dr.ndcId = nd.id',
      )
      .leftJoinAndMapMany(
        'asse.assessmentYear',
        AssessmentYear,
        'asseYear',
        'asseYear.assessmentId = asse.id',
      )
      .leftJoinAndMapMany(
        'asse.assessementResult',
        AssessmentResault,
        'asseResult',
        'asseResult.assementId = asse.id',
      )


      .where(filter, {
        filterText: `%${filterText}%`,
        year,
        selectedNdcIds,
        countryIdFromTocken

      })
      .orderBy('dr.createdOn', 'DESC');



    console.log(
      '=====================================================================',
    );
    //console.log(data.getQuery());

    let result = await paginate(data, options);
    console.log("results..", result);
    if (result) {
      return result;
    }
  }


  async getProjectsForCountrySectorInstitution(options: IPaginationOptions,
    sectorId: number,
    projectApprovalStatus: number[],
    ndcId: number,
    subNdcId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionIdFromTocken: number
  ): Promise<Pagination<Project>> {


    let filter: string = '';

    // console.log("context",sectorIdFromTocken)
    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      // console.log('sectorIdFromTocken')
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorIdFromTocken  `;
      } else {
        filter = `dr.sectorId = :sectorIdFromTocken`;
      }
    }
    else if (institutionIdFromTocken) {
      if (filter) {
        filter = `${filter}  and dr.mappedInstitutionId = :institutionIdFromTocken`;
      } else {
        filter = `dr.mappedInstitutionId = :institutionIdFromTocken`;
      }

    }
    else {

      if (sectorId != 0) {

        if (filter) {
          // console.log('sectorId1',sectorId)
          filter = `${filter}  and dr.sectorId = :sectorId`;
        } else {
          // console.log('sectorId2',sectorId)
          filter = `dr.sectorId = :sectorId`;
        }
      }


    }


    if (projectApprovalStatus && projectApprovalStatus.length > 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId IN (:...projectApprovalStatus)`;
      } else {
        filter = `dr.projectApprovalStatusId IN  (:...projectApprovalStatus)`;
      }
    }
    if (ndcId != 0) {
      if (filter) {
        filter = `${filter}  and dr.ndcId = :ndcId`;
      } else {
        filter = `dr.ndcId = :ndcId`;
      }
    }
    if (subNdcId != 0) {
      if (filter) {
        filter = `${filter}  and dr.subNdcId = :subNdcId`;
      } else {
        filter = `dr.subNdcId = :subNdcId`;
      }
    }


    let data = this.repo
      .createQueryBuilder('dr')
      .where(filter, {
        countryIdFromTocken,
        sectorIdFromTocken,
        sectorId,
        institutionIdFromTocken,
        projectApprovalStatus,
        ndcId, subNdcId
      })
      .orderBy('dr.createdOn', 'ASC')
      .groupBy('dr.id');

    let result = await paginate(data, options);

    if (result) {
      // console.log("resu",result);
      return result;
    }

  }


}
