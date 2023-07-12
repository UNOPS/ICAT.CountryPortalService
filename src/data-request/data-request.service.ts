import { User } from 'src/users/user.entity';
import { DataRequestStatus } from './entity/data-request-status.entity';
import { Institution } from './../institution/institution.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { Project } from 'src/project/entity/project.entity';
import { ParameterRequest } from './entity/data-request.entity';

import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { UpdateDeadlineDto } from './dto/dataRequest.dto';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { ParameterHistoryAction } from 'src/parameter-history/entity/parameter-history-action-history.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { DefaultValue } from 'src/default-value/entity/defaultValue.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Country } from 'src/country/entity/country.entity';
import { VerifierAcceptance } from 'src/parameter/enum/verifier-acceptance.enum';

@Injectable()
export class ParameterRequestService extends TypeOrmCrudService<ParameterRequest> {
  constructor(
    @InjectRepository(ParameterRequest) repo,
    private readonly userService: UsersService,
    private readonly parameterHistoryService: ParameterHistoryService,
    private readonly emaiService: EmailNotificationService,
    @InjectRepository(Parameter)
    public paramterRepo: Repository<Parameter>,
    @InjectRepository(Institution)
    public institutionRepo: Repository<Institution>,
    @InjectRepository(User)
    public userRepo: Repository<User>,
    @InjectRepository(DefaultValue)
    public defaultValRepo: Repository<DefaultValue>,
    @InjectRepository(Project)
    public ProjectRepo: Repository<Project>,
  ) {
    super(repo);
  }

  async getDateRequestToManageDataStatus(
    assessmentId: number,
    assessmentYear: number,
  ): Promise<any> {
    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .select(['dr.dataRequestStatus', 'para.id', 'para.verifierAcceptance'])
      .where(
        `para.assessmentId = ${assessmentId} AND para.verifierAcceptance <> 'REJECTED' AND ((para.isEnabledAlternative = true AND para.isAlternative = true) OR (para.isEnabledAlternative = false AND para.isAlternative = false )) AND COALESCE(para.AssessmentYear ,para.projectionBaseYear ) = ${assessmentYear}`,
      );

    return await data.execute();
  }

  async getNewDataRequest(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    dataProvider: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Pagination<any>> {
    const whereCond = (
      (climateActionId != 0
        ? `p.id=${climateActionId} AND  p.countryId = ${countryIdFromTocken} AND `
        : '') +
      (year != '' ? `ay.assessmentYear='${year}' AND ` : '') +
      (dataProvider != 0 ? `para.institutionId=${dataProvider} AND ` : '') +
      '((para.isEnabledAlternative = true AND para.isAlternative = true) OR (para.isEnabledAlternative = false AND para.isAlternative = false) ) AND ' +
      `dr.dataRequestStatus in (-1,1,30,-6) AND ` +
      (filterText != ''
        ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%' OR i.name LIKE '%${filterText}%'
           )`
        : '')
    ).replace(/AND $/, '');

    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapOne(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessmentId',
      )
      .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.projectId')
      .innerJoinAndMapOne(
        'p.Country',
        Country,
        'cou',
        `p.countryId = cou.id and p.countryId = ${countryIdFromTocken}`,
      )
      .leftJoinAndMapOne(
        'a.AssessmentYear',
        AssessmentYear,
        'ay',
        'a.id = ay.assessmentId',
      )
      .leftJoinAndMapOne(
        'para.institution',
        Institution,
        'i',
        'i.id = para.institutionId',
      )

      .where(whereCond)
      .orderBy('dr.createdOn', 'DESC')
      .groupBy('dr.id');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getNewDataRequestForClimateList(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    dataProvider: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Pagination<any>> {
    const whereCond = (
      (climateActionId != 0
        ? `p.id=${climateActionId} AND  p.countryId = ${countryIdFromTocken} AND `
        : '') +
      (year != '' ? `ay.assessmentYear='${year}' AND ` : '') +
      (dataProvider != 0 ? `para.institutionId=${dataProvider} AND ` : '') +
      '((para.isEnabledAlternative = true AND para.isAlternative = true) OR (para.isEnabledAlternative = false AND para.isAlternative = false) ) AND ' +
      `dr.dataRequestStatus in (-1,1,30,-6) AND ` +
      (filterText != ''
        ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%' OR i.name LIKE '%${filterText}%'
           )`
        : '')
    ).replace(/AND $/, '');

    const data = this.repo
      .createQueryBuilder('dr')
      .select(['dr.id', 'para.id ', 'a.id as aid', 'p.id as pid'])
      .leftJoinAndMapOne(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapOne(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessmentId',
      )
      .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.projectId')
      .innerJoinAndMapOne(
        'p.Country',
        Country,
        'cou',
        `p.countryId = cou.id and p.countryId = ${countryIdFromTocken}`,
      )
      .leftJoinAndMapOne(
        'a.AssessmentYear',
        AssessmentYear,
        'ay',
        'a.id = ay.assessmentId',
      )
      .leftJoinAndMapOne(
        'para.institution',
        Institution,
        'i',
        'i.id = para.institutionId',
      )
      .where(whereCond)
      .orderBy('dr.createdOn', 'DESC')
      .groupBy('dr.id');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getDateRequest(
    options: IPaginationOptions,
    filterText: string,
  ): Promise<Pagination<any>> {
    let filter = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.climateActionName LIKE :filterText  OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
    }

    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapMany(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessmentId',
      )
      .leftJoinAndMapMany(
        'a.AssessmentYear',
        AssessmentYear,
        'ay',
        'a.id = ay.assessmentId',
      )
      .leftJoinAndMapMany('a.Prject', Project, 'p', 'p.id = a.projectId')
      .select([
        'p.climateActionName as climateAction',
        'para.AssessmentYear as year',
        'a.assessmentType as assessmentType',
        'dr.dataRequestStatus as dataRequestStatus',
        'dr.id as id',
      ])
      .where(filter, {
        filterText: `%${filterText}%`,
      })
      .orderBy('dr.createdOn', 'DESC');
    const result = await data.execute();

    if (result) {
      return result;
    }
  }

  async getAssignDataRequest(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    userName: string,
  ): Promise<Pagination<any>> {
    const userItem = await this.userService.findByUserName(userName);
    const institutionId = userItem.institution ? userItem.institution.id : 0;

    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.parameterId',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapOne(
        'para.Institution',
        Institution,
        'i',
        'i.id = para.institutionId',
      )
      .leftJoinAndMapOne(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessmentId',
      )
      .leftJoinAndMapOne(
        'a.AssessmentYear',
        AssessmentYear,
        'ay',
        'a.id = ay.assessmentId',
      )
      .leftJoinAndMapOne('a.User', User, 'u', 'u.id = dr.UserDataEntry')
      .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.projectId')
      .where(
        (
          (institutionId != 0 ? `i.id=${institutionId} AND ` : '') +
          (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
          `dr.dataRequestStatus in (2,3,-9,-10) AND ` +
          (filterText != ''
            ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%' OR u.username LIKE '%${filterText}%'
           )`
            : '')
        ).replace(/AND $/, ''),
      )
      .orderBy('dr.createdOn', 'DESC')
      .groupBy('dr.id');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getEnterDataParameter(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    userName: string,
  ): Promise<Pagination<any>> {
    const userItem = await this.userService.findByUserName(userName);

    const userId = userItem ? userItem.id : 0;
    const insId = userItem ? userItem.institution.id : 0;

    if (userItem.userType.name != 'Institution Admin') {
      const data = this.repo
        .createQueryBuilder('dr')
        .leftJoinAndMapOne(
          'dr.parameterId',
          Parameter,
          'para',
          'para.id = dr.parameterId',
        )
        .leftJoinAndMapOne(
          'para.Assessment',
          Assessment,
          'a',
          'a.id = para.assessmentId',
        )
        .leftJoinAndMapOne(
          'a.AssessmentYear',
          AssessmentYear,
          'ay',
          'a.id = ay.assessmentId',
        )
        .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.projectId')
        .leftJoinAndMapOne('a.User', User, 'u', 'u.id = dr.UserDataEntry')
        .where(
          (
            (userId != 0 ? `u.id=${userId} AND ` : '') +
            (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
            `dr.dataRequestStatus in (4,5,-8) AND ` +
            (year != '' ? `ay.AssessmentYear ='${year}' AND ` : '') +
            (filterText != ''
              ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%')`
              : '')
          ).replace(/AND $/, ''),
        )
        .groupBy('dr.id')
        .orderBy('dr.deadline', 'DESC');

      const result = await paginate(data, options);

      if (result) {
        return result;
      }
    } else {
      const data = this.repo
        .createQueryBuilder('dr')
        .leftJoinAndMapOne(
          'dr.parameterId',
          Parameter,
          'para',
          'para.id = dr.parameterId',
        )
        .leftJoinAndMapOne(
          'para.Assessment',
          Assessment,
          'a',
          'a.id = para.assessmentId',
        )
        .leftJoinAndMapOne(
          'a.AssessmentYear',
          AssessmentYear,
          'ay',
          'a.id = ay.assessmentId',
        )
        .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.projectId')
        .leftJoinAndMapOne(
          'para.Institution',
          Institution,
          'ins',
          'para.institutionId = ins.id',
        )
        .where(
          (
            (insId != 0 ? `para.institutionId=${insId} AND ` : '') +
            (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
            `dr.dataRequestStatus in (4,5,-8) AND ` +
            (year != '' ? `ay.AssessmentYear ='${year}' AND ` : '') +
            (filterText != ''
              ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%')`
              : '')
          ).replace(/AND $/, ''),
        )
        .orderBy('dr.deadline', 'DESC');

      const result = await paginate(data, options);

      if (result) {
        return result;
      }
    }
  }

  async getReviewDataRequest(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    type: string,
    userName: string,
  ): Promise<Pagination<any>> {
    const userItem = await this.userService.findByUserName(userName);
    const institutionId = userItem.institution ? userItem.institution.id : 0;

    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapOne(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessmentId',
      )
      .leftJoinAndMapOne(
        'a.AssessmentYear',
        AssessmentYear,
        'ay',
        'a.id = ay.assessmentId',
      )
      .leftJoinAndMapOne(
        'para.Institution',
        Institution,
        'i',
        'i.id = para.institutionId',
      )
      .leftJoinAndMapOne('a.User', User, 'u', 'u.id = dr.UserDataEntry')
      .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.projectId')
      .where(
        (
          (institutionId != 0 ? `i.id=${institutionId} AND ` : '') +
          (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
          `dr.dataRequestStatus in (6,7,-6) AND ` +
          (type != '' ? `a.assessmentType='${type}' AND ` : '') +
          (year != '' ? `ay.assessmentYear='${year}' AND ` : '') +
          (filterText != ''
            ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%' OR u.username LIKE '%${filterText}%' OR a.assessmentType  LIKE '%${filterText}%'
           )`
            : '')
        ).replace(/AND $/, ''),
      )
      .groupBy('dr.id');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async updateDeadlineForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      const dataRequestItem = await this.repo.findOne({ where: { id: id } });

      const ss = await this.paramterRepo.findByIds([
        dataRequestItem.parameter.id,
      ]);
      if (ss[0].institution != null) {
        const template =
          'Dear ' +
          ss[0].institution.name +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> parameter name' +
          ss[0].name +
          '<br/> deadline ' +
          updateDataRequestDto.deadline;

        this.emaiService.sendMail(
          ss[0].institution.email,
          'Assign Deadline request',
          '',
          template,
        );
      }

      const originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.deadline = updateDataRequestDto.deadline;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      this.repo.save(dataRequestItem).then((res) => {
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.DataRequest,
          'DataRequest',
          '',
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
    }

    return true;
  }

  async updateDataEntryDeadlineForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      const dataRequestItem = await this.repo.findOne({ where: { id: id } });

      const user = await this.userRepo.findByIds([updateDataRequestDto.userId]);

      const originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.deadlineDataEntry = updateDataRequestDto.deadline;
      dataRequestItem.UserDataEntry = updateDataRequestDto.userId;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;

      const template =
        'Dear ' +
        user[0].fullName +
        ' ' +
        user[0].lastName +
        ' <br/> Data request with following information has shared with you.' +
        '<br/> Parameter name' +
        dataRequestItem.parameter.name +
        '<br/> deadline ' +
        updateDataRequestDto.deadline +
        '<br> comment' +
        updateDataRequestDto.comment;

      this.emaiService.sendMail(
        user[0].email,
        'Assign New Data Entry',
        '',
        template,
      );

      this.repo.save(dataRequestItem).then((res) => {
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.AssignDataRequest,
          'AssignDataRequest',
          '',
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
    }

    return true;
  }

  async acceptReviewDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    let insSec: any;
    let inscon: any;

    if (updateDataRequestDto.verificationStatus && updateDataRequestDto.verificationStatus === 8){
      let paraRequests = await this.repo.findByIds(updateDataRequestDto.ids)
  
      let parameters = paraRequests.map(req =>{ return req.parameter})
      parameters = parameters.map(para => {
        para.verifierAcceptance = VerifierAcceptance.DATA_ENTERED
        return para
      })
      await this.paramterRepo.save(parameters)
    }



    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });
      let originalStatus = dataRequestItem
        ? dataRequestItem.dataRequestStatus
        : 0;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      if (
        dataRequestItem.dataRequestStatus &&
        dataRequestItem.dataRequestStatus == DataRequestStatus.Data_Approved
      ) {
        dataRequestItem.qaStatus = null;
      }

      inscon = dataRequestItem.parameter.institution.country;
      insSec = dataRequestItem.parameter.institution.sector;

      this.repo.save(dataRequestItem).then((res) => {
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.EnterData,
          'EnterData',
          '',
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });

      let filter = '';
      filter = `dr.id = :id`;
      const data = this.repo
        .createQueryBuilder('dr')
        .leftJoinAndMapOne(
          'dr.parameter',
          Parameter,
          'pm',
          'dr.ParameterId= pm.id',
        )
        .where(filter, { id });
      const result = await data.getOne();

      const paraId = result.parameter.id;

      const parameterItem = await this.paramterRepo.findOne({
        where: { id: paraId },
      });
      if (parameterItem.isDefault == true) {
        const defaultVal = parameterItem.value;

        let filter = '';
        filter = `pr.id = :paraId`;
        const data2 = this.defaultValRepo
          .createQueryBuilder('df')
          .leftJoinAndMapOne(
            'df.parameter',
            Parameter,
            'pr',
            'df.id = pr.defaultValueId',
          )
          .where(filter, { paraId });
        const result2 = await data2.getOne();

        const defaultValId = result2.id;

        const defaultValObject = await this.defaultValRepo.findOne({
          where: { id: defaultValId },
        });
        defaultValObject.value = defaultVal;
        const savedObject = await this.defaultValRepo.save(defaultValObject);
      }
    }
    const ins = await this.institutionRepo.findOne({
      where: { country: inscon, sector: insSec, type: 2 },
    });
    const user: User[] = await this.userRepo.find({
      where: { country: inscon, userType: 6, institution: ins },
    });
    user.forEach((ab) => {
      let template: any;
      if (updateDataRequestDto.comment != undefined) {
        template =
          'Dear ' +
          ab.username +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Accepted reviw value' +
          '<br> comment -: ' +
          updateDataRequestDto.comment;
      } else {
        template =
          'Dear ' +
          ab.username +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Accepted reviw value ';
      }

      this.emaiService.sendMail(ab.email, 'Accepted parameter', '', template);
    });

    return true;
  }

  async rejectEnterDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      const dataRequestItem = await this.repo.findOne({ where: { id: id } });
      const originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.noteDataRequest = updateDataRequestDto.comment;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      dataRequestItem.UserDataEntry = updateDataRequestDto.userId;

      const email = dataRequestItem.parameter.institution.email;
      let template: any;
      if (updateDataRequestDto.comment != undefined) {
        template =
          'Dear ' +
          dataRequestItem.parameter.institution.name +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Reject enterd value' +
          '<br/> parameter name -: ' +
          dataRequestItem.parameter.name +
          '<br> comment -: ' +
          updateDataRequestDto.comment;
      } else {
        template =
          'Dear ' +
          dataRequestItem.parameter.institution.name +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Reject enterd value' +
          '<br/> parameter name -: ' +
          dataRequestItem.parameter.name;
      }

      this.emaiService.sendMail(email, 'Reject enterd value', '', template);

      this.repo.save(dataRequestItem).then((res) => {
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.EnterData,
          'EnterData',
          res.noteDataRequest,
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
    }

    return true;
  }

  async rejectReviewDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      const dataRequestItem = await this.repo.findOne({ where: { id: id } });
      const originalStatus = dataRequestItem.dataRequestStatus;

      let parameter = dataRequestItem.parameter
      parameter.value = null
      await this.paramterRepo.save(parameter)

      const user = await this.userRepo.findByIds([updateDataRequestDto.userId]);
      let template: any;

      if (updateDataRequestDto.status === -9) {
        let ins = dataRequestItem.parameter;
        template =
          'Dear ' +
          ins.institution.name +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> We are assign  Data entry' +
          '<br/> deadline ' +
          updateDataRequestDto.deadline +
          '<br> comment' +
          updateDataRequestDto.comment;
        this.emaiService.sendMail(
          ins.institution.email,
          'Assign  Data Entry',
          '',
          template,
        );
      } else {
        if (updateDataRequestDto.comment != undefined) {
          template =
            'Dear ' +
            user[0].fullName +
            ' ' +
            user[0].lastName +
            '<br/>Data request with following information has shared with you.' +
            ' <br/> We are assign  Data entry' +
            '<br/> deadline ' +
            updateDataRequestDto.deadline +
            '<br> comment' +
            updateDataRequestDto.comment;
          this.emaiService.sendMail(
            user[0].email,
            'Assign  Data Entry',
            '',
            template,
          );
        } else {
          template =
            'Dear ' +
            user[0].fullName +
            ' ' +
            user[0].lastName +
            '<br/>Data request with following information has shared with you.' +
            ' <br/> We are assign new Data entry' +
            '<br/> deadline ' +
            updateDataRequestDto.deadline;

          this.emaiService.sendMail(
            user[0].email,
            'Assign  Data Entry',
            '',
            template,
          );
        }
      }

      dataRequestItem.noteDataRequest = updateDataRequestDto.comment;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      dataRequestItem.UserDataEntry = updateDataRequestDto.userId;
      this.repo.save(dataRequestItem).then((res) => {
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.ReviewData,
          'ReviewData',
          res.noteDataRequest,
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
    }

    return true;
  }

  async getClimateActionByDataRequestStatus(): Promise<any> {
    const data = this.ProjectRepo.createQueryBuilder('pr')
      .leftJoinAndMapMany(
        'pr.Assessment',
        Assessment,
        'ass',
        'pr.id = ass.projectId',
      )
      .leftJoinAndMapMany(
        'ass.Parameter',
        Parameter,
        'para',
        'ass.id = para.assessmentId',
      )
      .leftJoinAndMapOne(
        'para.DataRequest',
        ParameterRequest,
        'paraReq',
        'para.id = paraReq.ParameterId',
      )
      .where('paraReq.dataRequestStatus = ' + 2);

    const result = await data.getMany();

    return result;
  }

  async getClimateActionByDataRequestStatusSix(): Promise<any> {
    const data = this.ProjectRepo.createQueryBuilder('pr')
      .leftJoinAndMapMany(
        'pr.Assessment',
        Assessment,
        'ass',
        'pr.id = ass.projectId',
      )
      .leftJoinAndMapMany(
        'ass.Parameter',
        Parameter,
        'para',
        'ass.id = para.assessmentId',
      )
      .leftJoinAndMapOne(
        'para.DataRequest',
        ParameterRequest,
        'paraReq',
        'para.id = paraReq.ParameterId',
      )
      .where('paraReq.dataRequestStatus = ' + 6);

    const result = await data.getMany();

    return result;
  }
}
