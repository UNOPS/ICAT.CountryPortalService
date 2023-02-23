import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Country } from 'src/country/entity/country.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Institution } from 'src/institution/institution.entity';
import { ProjectApprovalStatusService } from 'src/master-data/project-approval-status/project-approval-status.service';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Repository } from 'typeorm';
import { defaultValueDtos } from './dto/defaultValue.dto';
import { DefaultValue } from './entity/defaultValue.entity';

@Injectable()
export class DefaultValueService extends TypeOrmCrudService<DefaultValue> {
  constructor(
    @InjectRepository(DefaultValue) repo,
    @InjectRepository(Parameter)
    public paramterRepo: Repository<Parameter>,
    @InjectRepository(Institution)
    public insRepo: Repository<Institution>,
    @InjectRepository(ParameterRequest)
    public parameterRequestRepo: Repository<ParameterRequest>,
  ) {
    super(repo);
  }

  async sendDefaultValue(defaultDto: defaultValueDtos): Promise<any> {
    const recievedYeras = defaultDto['year'];

    for (const x of recievedYeras) {
      const defaultvalObject = await this.repo.findOne(defaultDto.parentId);
      const instituition = await this.insRepo.findOne(defaultDto.source['id']);

      const defltVal = new DefaultValue();
      defltVal.parameterName = defaultDto.parameterName;
      defltVal.parentId = defaultDto.parentId;
      defltVal.unit = defaultvalObject.unit;
      defltVal.administrationLevel = defaultDto.administrationLevel;
      defltVal.source = defaultDto.source['name'];
      defltVal.year = x;
      defltVal.country = defaultDto.country;
      const savedDefaultValue = await this.repo.save(defltVal);

      const parameterObject = new Parameter();
      const name =
        savedDefaultValue.parameterName +
        ' - ' +
        savedDefaultValue.administrationLevel;
      parameterObject.name = name;
      parameterObject.originalName = name;
      parameterObject.isDefault = true;
      parameterObject.uomDataRequest = savedDefaultValue.unit;
      parameterObject.institution = instituition;
      parameterObject.defaultValue = savedDefaultValue;
      parameterObject.AssessmentYear = x;
      const savedParaValue = await this.paramterRepo.save(parameterObject);

      const datareq = new ParameterRequest();
      datareq.deadlineDataEntry = defaultDto.deadLine;
      datareq.dataRequestStatus = 2;
      datareq.parameter = savedParaValue;
      const savedDataRequest = await this.parameterRequestRepo.save(datareq);
    }

    return { message: 'success' };
  }

  async createValue(def: DefaultValue) {
    return await this.repo.save(def);
  }

  async getDefaultvalueInfo(
    options: IPaginationOptions,
    filterText: string,
    source: string,
    year: string,
    status: string,
    countryIdFromTocken: number,
  ): Promise<Pagination<DefaultValue>> {
    let filter = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dv.parameterName LIKE :filterText OR dv.administrationLevel LIKE :filterText OR dv.source LIKE :filterText)';
    }

    if (source != null && source != undefined && source != '') {
      if (filter) {
        filter = `${filter}  and dv.source = :source`;
      } else {
        filter = `dv.source = :source`;
      }
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and cou.id = :countryIdFromTocken`;
      } else {
        filter = `cou.id = :countryIdFromTocken`;
      }
    }

    if (year != null && year != undefined && year != '') {
      if (filter) {
        filter = `${filter}  and dv.year = :year`;
      } else {
        filter = `dv.year = :year`;
      }
    }

    if (status != null && status != undefined && status != '') {
      if (filter) {
        if (status == 'Pending') {
          filter = `${filter}  and dv.value IS NULL`;
        }
        if (status == 'Available') {
          filter = `${filter}  and dv.value IS NOT NULL`;
        }
      } else {
        if (status == 'Pending') {
          filter = `dv.value IS NULL`;
        }
        if (status == 'Available') {
          filter = `dv.value IS NOT NULL`;
        }
      }
    }

    const data = this.repo
      .createQueryBuilder('dv')
      .leftJoinAndMapOne('dv.Country', Country, 'cou', 'dv.countryId = cou.id')
      .where(filter, {
        filterText: `%${filterText}%`,
        source,
        year,
        countryIdFromTocken,
      })
      .orderBy('dv.createdOn', 'ASC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }
}
