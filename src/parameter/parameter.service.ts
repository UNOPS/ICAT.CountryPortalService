import { ParameterRequest } from './../data-request/entity/data-request.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { Institution } from 'src/institution/institution.entity';
import { Project } from 'src/project/entity/project.entity';
import { Parameter } from './entity/parameter.entity';
import { UpdateValueEnterData } from './dto/updateValueEnterData.dto';
import { Repository } from 'typeorm';
import { UnitConversion } from 'src/unit-conversion/entity/unit-conversion.entity';
import { DataRequestStatus } from 'src/data-request/entity/data-request-status.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';

const schema = {
  id: {
    prop: 'id',
    type: Number,
  },
  value: {
    prop: 'value',
    type: Number,
  },
  unit: {
    prop: 'unit',
    type: String,
  },
};

@Injectable()
export class ParameterService extends TypeOrmCrudService<Parameter> {
  constructor(
    @InjectRepository(Parameter) repo,
    private readonly emaiService: EmailNotificationService,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
    @InjectRepository(UnitConversion)
    private readonly unitConversionRepository: Repository<UnitConversion>,
    @InjectRepository(ParameterRequest)
    private readonly parameterRequestRepository: Repository<ParameterRequest>,
  ) {
    super(repo);
  }

  readXlsxFile = require('read-excel-file/node');

  async getParameterByAssesment(id: number): Promise<Parameter[]> {
    const assement = new Assessment();
    assement.id = id;
    return await this.repo.find({ where: { assessment: assement } });
  }

  async GetParameterForIaDash(
    //  countryIdFromTocken:number,
    //  sectorIdFromTocken:number ,
    institutionIdFromTocken: number,
  ): Promise<Parameter[]> {
    console.log('para1234', institutionIdFromTocken);

    const data = this.repo
      .createQueryBuilder('par')
      .innerJoinAndMapOne(
        'par.parameterRequest',
        ParameterRequest,
        'p',
        'p.ParameterId = par.id and p.dataRequestStatus not in( -1,30,9,11,1,6)',
      )
      .where('par.institutionId = :institutionIdFromTocken', { institutionIdFromTocken });
    let result = await data.getMany();

    //  console.log('para1234',result)
    return result;
  }

  async updateEnterDataValue(
    /// Unit Conversion Applied
    updateValueDto: UpdateValueEnterData,
  ): Promise<boolean> {
    const dataEnterItem = await this.repo.findOne({
      where: { id: updateValueDto.id },
    });
    // console.log('dataEnterItem+++',dataEnterItem)
    if (dataEnterItem) {
      dataEnterItem.value = updateValueDto.value;
      if (updateValueDto.assumptionParameter != null) {
        dataEnterItem.enterDataAssumption = updateValueDto.assumptionParameter;
      }
      dataEnterItem.uomDataEntry = updateValueDto.unitType;
      if (dataEnterItem.uomDataEntry != dataEnterItem.uomDataRequest) {
        const ratioItem = await this.unitConversionRepository.findOne({
          where: {
            fromUnit: updateValueDto.unitType,
            toUnit: dataEnterItem.uomDataRequest,
          },
        });
        if (ratioItem) {
          dataEnterItem.conversionValue = (
            Number(updateValueDto.value) * ratioItem.conversionFactor
          ).toString();
        }
      } else {
        dataEnterItem.conversionValue = updateValueDto.value;
      }
      this.repo.save(dataEnterItem);
      return true;
    }
    return false;
  }

  async updateInstitution(
    updateValueDto: UpdateValueEnterData,
  ): Promise<boolean> {
    const institutionItem = await this.institutionRepository.findOne({
      where: { id: updateValueDto.institutionId }
    });
    let data = this.parameterRequestRepository.findOne({
      where: { id: updateValueDto.id },
    });
    const dataEnterItem = await this.repo.findOne({
      where: { id: (await data).parameter.id }
    });
    // dataEnterItem.value = updateValueDto.value;  // not comming value
    dataEnterItem.institution = institutionItem;
    console.log('updateValueDto', updateValueDto);
    console.log('institutionItem', institutionItem);
    this.repo.save(dataEnterItem);

    const template = 'Dear ' +
    institutionItem.name + ' '  +
    '<br/>Data request with following information has shared with you.'+
    ' <br/> We are assign  Data entry' ;

    this.emaiService.sendMail(
      institutionItem.email,
      'Assign  Data Entry',
      '',
      template,
    );
    return true;
  }

  async GetParameterHistoryForQA(name: string, countryIdFromTocken: number) {
    const data = this.repo
      .createQueryBuilder('par')
      .innerJoinAndMapOne(
        'par.assessment',
        Assessment,
        'asse',
        'par.assessmentId = asse.id',
      )
      .innerJoinAndMapOne(
        'asse.project',
        Project,
        'pro',
        'asse.projectId = pro.id',
      )
      .innerJoinAndMapOne(
        'par.parameterRequest',
        ParameterRequest,
        'p',
        'p.ParameterId = par.id',
      )
      .where('par.name = :name and p.qaStatus = 4 and pro.countryId= :countryIdFromTocken', { name,countryIdFromTocken });

    return data.getMany();
  }

  async updateParameterAlternative(parameters: Parameter[]) {
    const parentPara = parameters.filter(para => (para.isAlternative == false && para.isEnabledAlternative == true))

    const childPara = parameters.filter(para => (para.isAlternative == true && para.isEnabledAlternative == true));

    for (const para of childPara) {
      const data= await this.parameterRequestRepository.findOne({
        where: { parameter: {id: parentPara[0].id} }
      });
      const cdata= await this.parameterRequestRepository.findOne({
        where: { parameter: {id: para.id} }
      });
      const paraReq = new ParameterRequest();
      if (cdata === undefined) {
        if (data) {
          paraReq.status = data.status;
          paraReq.deadline = data.deadline;
          paraReq.deadlineDataEntry = data.deadlineDataEntry;
          paraReq.UserDataEntry = data.UserDataEntry;
          paraReq.dataRequestStatus = data.dataRequestStatus;
        }
        paraReq.parameter = para;

        this.parameterRequestRepository.save(paraReq);
      }
    }

    let result = this.repo.save(parameters);
    // console.log('result',result)
    return true;
  }

  async uplaodFileUpload(fileName: string) {
    this.readXlsxFile('./uploads/' + fileName, { schema }).then(
      ({ rows, errors }) => {
        rows.forEach(async (key) => {
          let dataEnterItem = await this.repo.findOne({
            where: { id: key.id },
          });

          const dataStatusItem = await this.parameterRequestRepository.find({
          where: { parameter: key.id }
        })

          console.log(' key name =====', key);
          console.log(' dataEnterItem  +++ =====', dataEnterItem);
          console.log('dataStatusItem=====+++', dataStatusItem);

          dataStatusItem.forEach(async (e) => {
            console.log('++++++++eeeee=======', e.dataRequestStatus);
            if (e.dataRequestStatus === 4 || e.dataRequestStatus === 5) {
              dataEnterItem.value = key.value;
              dataEnterItem.uomDataEntry = key.unit;

              if (dataEnterItem.uomDataEntry != dataEnterItem.uomDataRequest) {
                let ratioItem = await this.unitConversionRepository.findOne({
                  where: {
                    fromUnit: key.unit,
                    toUnit: dataEnterItem.uomDataRequest,
                  },
                });
                if (ratioItem) {
                  dataEnterItem.conversionValue = (
                    Number(key.value) * ratioItem.conversionFactor
                  ).toString();
                }
              } else {
                dataEnterItem.conversionValue = key.value;
              }

              this.repo.save(dataEnterItem);
            }
          });
        });
      },
    );
  }
}
