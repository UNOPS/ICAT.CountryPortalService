import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Repository } from 'typeorm';
import { ParameterHistoryAction } from './entity/parameter-history-action-history.entity';
import { ParameterHistory } from './entity/parameter-history.entity';

@Injectable()
export class ParameterHistoryService extends TypeOrmCrudService<ParameterHistory> {
  constructor(
    @InjectRepository(ParameterHistory) repo,
    @InjectRepository(Parameter)
    private readonly parameterRepo: Repository<Parameter>,
    @InjectRepository(ParameterRequest)
    private readonly parameterRequestRepo: Repository<ParameterRequest>,
  ) {
    super(repo);
  }

  public async SaveParameterHistory(
    dataReqestId: number,
    action: ParameterHistoryAction,
    description: string,
    comment: string,
    status: string,
    statusPrevious: string | null,
  ) {
    const datareqest = await this.parameterRequestRepo.findOne(dataReqestId);

    const data = this.parameterRequestRepo
      .createQueryBuilder('paraReq')
      .innerJoinAndMapOne(
        'paraReq.parameter',
        Parameter,
        'para',
        `paraReq.ParameterId = para.id and paraReq.id = ${dataReqestId}`,
      );

    const result1 = await data.getOne();

    const parameterHistory = new ParameterHistory();
    parameterHistory.description = description;
    parameterHistory.comment = comment;
    parameterHistory.parameterId = result1.parameter.id;
    parameterHistory.parameterName = result1.parameter?.name;
    parameterHistory.parameterCreatedDate = datareqest.createdOn;
    parameterHistory.parameterAllocatedDate = datareqest.deadline;
    parameterHistory.parameterAssignDateByIA = datareqest.deadlineDataEntry;
    parameterHistory.parameterStatus = status!;
    parameterHistory.parameterStatusPrevious = statusPrevious!;
    parameterHistory.deoAssumption = result1.parameter?.enterDataAssumption;
    parameterHistory.qcAssumption = datareqest?.qaComment;

    parameterHistory.Action = action;

    const param = await this.repo.insert(parameterHistory);
  }

  async getHistory(id: number): Promise<any> {
    const filter = 'as.parameterId = :id';
    const data = this.repo
      .createQueryBuilder('as')
      .where(filter, {
        id,
      })
      .orderBy('as.createdOn', 'DESC');

    return await data.getMany();
  }
}
