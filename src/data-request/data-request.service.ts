import { User } from 'src/users/user.entity';
import { DataRequestStatus } from './entity/data-request-status.entity';
import { Institution } from './../institution/institution.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Assessment } from 'src/assesment/entity/assesment.entity';
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
import { ParameterHistoryAction } from 'src/parameter-history/entity/paeameter-history-action-history.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { DefaultValue } from 'src/default-value/entity/defaultValue.entity';
import { UserType } from 'src/users/user.type.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Country } from 'src/country/entity/country.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
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
    assesmentId: number,
    assessmentYear: number,
  ): Promise<any> {
    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .select(['dr.dataRequestStatus', 'para.id'])
      .where(
        `para.assessmentId = ${assesmentId} AND para.verifierAcceptance <> 'REJECTED' AND ((para.isEnabledAlternative = true AND para.isAlternative = true) OR (para.isEnabledAlternative = false AND para.isAlternative = false )) AND COALESCE(para.AssessmentYear ,para.projectionBaseYear ) = ${assessmentYear}`,
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
    let whereCond = (
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

    console.log(whereCond);

    let data = this.repo
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
      // .innerJoinAndMapOne('p.Sector', Sector, 'sec', `p.sectorId = sec.id and p.sectorId = ${sectorIdFromTocken}`)
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

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')
      // .select([
      //   'p.climateActionName as climateAction',
      //   'a.assessmentType as assessmentType',
      //   'para.isAlternative as isAlternative',
      //   'para.isBaseline as isBaseline',
      //   'para.isProject as isProject',
      //   'para.isLekage as isLekage',
      //   'para.isProjection as isProjection',
      //   'i.name as dataProvider',
      //   'ay.assessmentYear as year',
      //   'para.name as parameter',
      //   'dr.deadline as deadline',
      //   'dr.status as status',
      //   'dr.id as id',
      // ])
      .where(whereCond)
      .orderBy('dr.createdOn', 'DESC')
      .groupBy('dr.id');
    console.log(options);
    let result = await paginate(data, options);

    // let pageResult = data
    //   .skip((options.limit as number) * ((options.page as number) - 1))
    //   .take(options.limit as number);
    //console.log('data2', data);

    // let result = await data.execute();
    //   console.log('result2', result2);
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
    let whereCond = (
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

    console.log(whereCond);

    let data = this.repo
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
      // .innerJoinAndMapOne('p.Sector', Sector, 'sec', `p.sectorId = sec.id and p.sectorId = ${sectorIdFromTocken}`)
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
    console.log(options);
    let result = await paginate(data, options);

    if (result) {
      // console.log(result);
      console.log('resulthhhhh====', result);
      return result;
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
      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')
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
    let result = await data.execute();
    //   console.log('result2', result2);
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
    let userItem = await this.userService.findByUserName(userName);
    let institutionId = userItem.institution ? userItem.institution.id : 0;

    let data = this.repo
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
      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')
      // .select([
      //   'p.climateActionName as climateAction',
      //   'para.name as parameter',
      //   'para.AssessmentYear as year',
      //   'dr.deadline as deadline',
      //   'dr.deadlineDataEntry as deadlineDEO',
      //   'u.username as userName',
      //   'dr.id as id',
      //   'dr.status as status',
      //   'u.id as userId',
      // ])
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

    // let result = await paginate(data, options);

    // let pageResult = data
    //   .skip((options.limit as number) * ((options.page as number) - 1))
    //   .take(options.limit as number);
    //console.log('data2', data);
    let result = await paginate(data, options);
    //let result = await data.execute();
    //   console.log('result2', result2);
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
    let userItem = await this.userService.findByUserName(userName);
    // console.log("userItem..",userItem.institution.id)
    let userId = userItem ? userItem.id : 0;
    let insId = userItem ? userItem.institution.id : 0;

    if (userItem.userType.name != 'Institution Admin') {
      let data = this.repo
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

      let result = await paginate(data, options);

      if (result) {
        return result;
      }
    } else {
      let data = this.repo
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

      let result = await paginate(data, options);

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
    console.log('userName', userName);
    let userItem = await this.userService.findByUserName(userName);
    let institutionId = userItem.institution ? userItem.institution.id : 0;

    let data = this.repo
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
      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')
      // .select([
      //   'p.climateActionName as climateAction',
      //   'a.assessmentType as assessmentType',
      //   'para.isAlternative as isAlternative',
      //   'para.isBaseline as isBaseline',
      //   'para.isProject as isProject',
      //   'para.isLekage as isLekage',
      //   'para.isProjection as isProjection',
      //   'i.name as dataProvider',
      //   'ay.assessmentYear as year',
      //   'para.name as parameter',
      //   'dr.deadline as deadline',
      //   'dr.status as status',
      //   'dr.id as id',
      // ])
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

    let result = await paginate(data, options);

    // let pageResult = data
    //   .skip((options.limit as number) * ((options.page as number) - 1))
    //   .take(options.limit as number);
    //console.log('data2', data);

    // let result = await data.execute();
    //   console.log('result2', result2);
    if (result) {
      return result;
    }
  }

  async updateDeadlineForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    //let dataRequestItemList = new Array<ParameterRequest>();
    console.log('updateDataRequestDto', updateDataRequestDto);

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });

      let ss = await this.paramterRepo.findByIds([
        dataRequestItem.parameter.id,
      ]);
      if (ss[0].institution != null) {
        console.log('sssssss', ss);
        var template =
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

      let originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.deadline = updateDataRequestDto.deadline;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      //dataRequestItemList.push(dataRequestItem);
      this.repo.save(dataRequestItem).then((res) => {
        // console.log('res', res);
        console.log('res id....', res.id);
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
    //let dataRequestItemList = new Array<ParameterRequest>();

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });
      console.log('updateDataRequestDto', updateDataRequestDto);
      let user = await this.userRepo.findByIds([updateDataRequestDto.userId]);

      let originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.deadlineDataEntry = updateDataRequestDto.deadline;
      dataRequestItem.UserDataEntry = updateDataRequestDto.userId;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;

      var template =
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
      // dataRequestItemList.push(dataRequestItem);
      this.repo.save(dataRequestItem).then((res) => {
        console.log('res', res);
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

    //this.repo.save(dataRequestItemList);

    return true;
  }

  async acceptReviewDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    // let dataRequestItemList = new Array<ParameterRequest>();

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
      // let parm =await this.paramterRepo.findByIds([id]);

      inscon = dataRequestItem.parameter.institution.country;
      insSec = dataRequestItem.parameter.institution.sector;

      // dataRequestItemList.push(dataRequestItem);
      // console.log('dataRequestItem', dataRequestItem);
      this.repo.save(dataRequestItem).then((res) => {
        //console.log('res', res);
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.EnterData,
          'EnterData',
          '',
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });

      let filter: string = '';
      filter = `dr.id = :id`;
      let data = this.repo
        .createQueryBuilder('dr')
        .leftJoinAndMapOne(
          'dr.parameter',
          Parameter,
          'pm',
          'dr.ParameterId= pm.id',
        )
        .where(filter, { id });
      let result = await data.getOne();
      // console.log("data...",result)

      const paraId = result.parameter.id;
      console.log('paraid', paraId);
      let parameterItem = await this.paramterRepo.findOne({
        where: { id: paraId },
      });
      if (parameterItem.isDefault == true) {
        let defaultVal = parameterItem.value;
        // console.log("defaultVal",defaultVal)
        // let defaultValId = parameterItem.defaultValue.id;

        let filter: string = '';
        filter = `pr.id = :paraId`;
        let data2 = this.defaultValRepo
          .createQueryBuilder('df')
          .leftJoinAndMapOne(
            'df.parameter',
            Parameter,
            'pr',
            'df.id = pr.defaultValueId',
          )
          .where(filter, { paraId });
        let result2 = await data2.getOne();
        //  console.log("result2",result2)

        let defaultValId = result2.id;
        // console.log("defaultValId",defaultValId)
        let defaultValObject = await this.defaultValRepo.findOne({
          where: { id: defaultValId },
        });
        defaultValObject.value = defaultVal;
        let savedObject = await this.defaultValRepo.save(defaultValObject);
        // console.log("defaultValObject...",defaultValObject)
      }
    }
    let user:User[];
    let ins = await this.institutionRepo.findOne({
      where: { country: inscon, sector: insSec, type: 2 },
    });
    user= await this.userRepo.find({where:{country:inscon,userType:6,institution:ins}})
    user.forEach((ab)=>{
      console.log('=========', ins);
      var template: any;
      if (updateDataRequestDto.comment != undefined) {
        template =
          'Dear ' +
          ab.username +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Accepted reviw value' +
          // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
          // '<br/> value -:' + dataRequestItem.parameter.value +
          '<br> comment -: ' +
          updateDataRequestDto.comment;
      } else {
        template =
          'Dear ' +
          ab.username +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Accepted reviw value ';
        // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
        // '<br/> value -:' + dataRequestItem.parameter.value;
      }
  
      this.emaiService.sendMail(ab.email, 'Accepted parameter', '', template);
    })
    
    // this.repo.save(dataRequestItemList);

    return true;
  }

  async rejectEnterDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    // let dataRequestItemList = new Array<ParameterRequest>();

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });
      let originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.noteDataRequest = updateDataRequestDto.comment;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      dataRequestItem.UserDataEntry = updateDataRequestDto.userId;

      let email = dataRequestItem.parameter.institution.email;
      var template: any;
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
        console.log('res', res);


        
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.EnterData,
          'EnterData',
          res.noteDataRequest,
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
      //  dataRequestItemList.push(dataRequestItem);
    }

    //this.repo.save(dataRequestItemList);

    return true;
  }

  async rejectReviewDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    // let dataRequestItemList = new Array<ParameterRequest>();

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });

      //update parameter
      let parameter = dataRequestItem.parameter
      parameter.value = null
      await this.paramterRepo.save(parameter)

      let originalStatus = dataRequestItem.dataRequestStatus;

      let user = await this.userRepo.findByIds([updateDataRequestDto.userId]);
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
        console.log('res', res);
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.ReviewData,
          'ReviewData',
          res.noteDataRequest,
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
      //  dataRequestItemList.push(dataRequestItem);
    }

    return true;
  }

  async getClimateActionByDataRequestStatus(): Promise<any> {
    let data = this.ProjectRepo.createQueryBuilder('pr')
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
        'para.id = paraReq.ParameterId', //and paraReq.dataRequestStatus = 2
      )
      .where('paraReq.dataRequestStatus = ' + 2);

    let result = await data.getMany();

    return result;
  }

  async getClimateActionByDataRequestStatusSix(): Promise<any> {
    let data = this.ProjectRepo.createQueryBuilder('pr')
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
        'para.id = paraReq.ParameterId', //and paraReq.dataRequestStatus = 2
      )
      .where('paraReq.dataRequestStatus = ' + 6);

    let result = await data.getMany();

    return result;
  }




  async getQCpassParameterRequest(
    paraIds: string[],
   
  ): Promise<any> {
  

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .where(
     'dr.qaStatus=4  and para.id in (:...paraIds)',{paraIds}
      )
      

    let result = await data.getMany();

    // let pageResult = data
    //   .skip((options.limit as number) * ((options.page as number) - 1))
    //   .take(options.limit as number);
    //console.log('data2', data);

    // let result = await data.execute();
    //   console.log('result2', result2);
    if (result) {
      return result;
    }
  }
}
