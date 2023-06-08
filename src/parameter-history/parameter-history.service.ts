import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Repository } from 'typeorm';
import { ParameterHistoryAction } from './entity/paeameter-history-action-history.entity';
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
    dataReqestId: number, // daat requst ID
    action: ParameterHistoryAction,
    description: string,
    comment: string,
    status: string,
    statusPrevious: string | null,
  ) {
    let datareqest = await this.parameterRequestRepo.findOne(dataReqestId); // let parametr
   // console.log("my datarequest id ..",datareqest.id)

    let data = this.parameterRequestRepo
    .createQueryBuilder('paraReq')
    .innerJoinAndMapOne(
      'paraReq.parameter',
      Parameter,
      'para',
      `paraReq.ParameterId = para.id and paraReq.id = ${dataReqestId}`,
    )
    //.where('paraHis.id = dataReqestId')

    let result1 = await data.getOne();
    console.log("my parameter111..",result1)


   // let parameter = await this.parameterRepo.findOne(datareqest.parameter.id);
   
   // console.log("my parameter..",parameter.name)

    let parameterHistory = new ParameterHistory();
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

    let param = await this.repo.insert(parameterHistory);
  }





  async getHistory(id: number): Promise<any> 
  {

    let filter1: string = 'as.parameterId = :id';
    var data1 = this.repo
      .createQueryBuilder('as')
      .where(filter1, {
        id,
        
      })
      .orderBy('as.createdOn', 'DESC');

  let parameter = await  this.parameterRepo.findOne(id);
  let previouseParameterhistry=[];
  if(parameter.previouseParameterId){
    const previouseParameterId=parameter.previouseParameterId
    let filter2: string = 'as.parameterId = :previouseParameterId';
    var data2 = this.repo
      .createQueryBuilder('as')
      .where(filter2, {
        previouseParameterId
        
      })
      .orderBy('as.createdOn', 'DESC');
      previouseParameterhistry=await data2.getMany();
  }

   


    // console.log('data.....',data)
    //console.log('query...', data.getQueryAndParameters());
    return [...await data1.getMany(),...previouseParameterhistry];
  }




}
