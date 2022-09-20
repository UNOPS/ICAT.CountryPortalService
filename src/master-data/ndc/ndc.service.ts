import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AssessmentResault } from 'src/assesment-resault/entity/assessment-resault.entity';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { Project } from 'src/project/entity/project.entity';
import { Ndc } from './ndc.entity';
import { SubNdc } from './sub-ndc.entity';

@Injectable()
export class NdcService extends TypeOrmCrudService<Ndc> {
 
  constructor(@InjectRepository(Ndc) repo) {
    super(repo);
  }


  async ndcSectorDetails(
    options: IPaginationOptions,
    sectorIds: string[],
    countryIdFromTocken: number,
       sectorIdFromTocken: number
  ): Promise<Pagination<any>>{
    let filter: string = '';

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

if(sectorIdFromTocken){ 
  // console.log('sectorIdFromTocken')
  if (filter) {
    filter = `${filter}  and dr.sectorId = :sectorIdFromTocken  `;
  } else {
    filter = `dr.sectorId = :sectorIdFromTocken`; 
}}

else{
 
  if(sectorIds && sectorIds.length>0){
   
    if (filter) {
      // console.log('sectorId1',sectorId)
      filter = `${filter}  and dr.sectorId  IN  (:...sectorIds) `;
    } else {
      // console.log('sectorId2',sectorId)
      filter = `dr.sectorId IN  (:...sectorIds) `;
    }
  }


}

    let data = this.repo
    .createQueryBuilder('dr')
   
    .where(filter, {
      sectorIds,
      countryIdFromTocken,
      sectorIdFromTocken
    })
    .orderBy('dr.createdOn', 'ASC'); 


    let resualt = await paginate(data, options);
    console.log(resualt)
    if (resualt) {
      return resualt;
    }
  }

  async ndcSectorDetailsDashboard(
    options: IPaginationOptions,
    sectorId: number,
    countryIdFromTocken: number,
       sectorIdFromTocken: number
  ): Promise<Pagination<any>>{
    let filter: string = '';

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

if(sectorIdFromTocken){ 
  // console.log('sectorIdFromTocken')
  if (filter) {
    filter = `${filter}  and dr.sectorId = :sectorIdFromTocken  `;
  } else {
    filter = `dr.sectorId = :sectorIdFromTocken`; 
}}

else{
 
  if(sectorId!=0){
   
    if (filter) {
      // console.log('sectorId1',sectorId)
      filter = `${filter}  and dr.sectorId = :sectorId`;
    } else {
      // console.log('sectorId2',sectorId)
      filter = `dr.sectorId = :sectorId`;
    }
  }


}

    let data = this.repo
    .createQueryBuilder('dr')
    .leftJoinAndMapMany(
      'dr.subNdc',
      SubNdc,
      'sub',
      'sub.ndcId = dr.id',
    )
    .innerJoinAndMapMany(
      'dr.project',
      Project,
      'pro',
      'pro.ndcId = dr.id',
    )
    .where(filter, {
      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken
    })
    .orderBy('dr.createdOn', 'ASC'); 


    let resualt = await paginate(data, options);
    console.log(resualt)
    if (resualt) {
      return resualt;
    }
  }


  async getNdcForDashboard(
    options: IPaginationOptions,
    sectorId: number,
    countryIdFromTocken: number,
       sectorIdFromTocken: number,
       moduleLevelsFromTocken:number[]
  ): Promise<Pagination<any>>{
    let filter: string = '';

    if(moduleLevelsFromTocken[3]==1){
      if (filter) {
        filter = `${filter}   and asse.isProposal= false `;
      } else {
        filter = `asse.isProposal= false`;
      }
    }else if(moduleLevelsFromTocken[1]==1){
      if (filter) {
        filter = `${filter}  and  asse.isProposal= true  `;
      } else {
        filter = `asse.isProposal= true`;
      }

    }else{
      if (filter) {
        filter = `${filter}  and  asse.isProposal= false `;
      } else {
        filter = `asse.isProposal= false`;
      }
    }


    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and ndc.countryId = :countryIdFromTocken`;
      } else {
        filter = `ndc.countryId = :countryIdFromTocken`;
      }
    }

if(sectorIdFromTocken){ 
  // console.log('sectorIdFromTocken')
  if (filter) {
    filter = `${filter}  and ndc.sectorId = :sectorIdFromTocken  `;
  } else {
    filter = `ndc.sectorId = :sectorIdFromTocken`; 
}}

else{
 
  if(sectorId && sectorId!=0){
   
    if (filter) {
      // console.log('sectorId1',sectorId)
      filter = `${filter}  and ndc.sectorId = :sectorId`;
    } else {
      // console.log('sectorId2',sectorId)
      filter = `ndc.sectorId = :sectorId`;
    }
  }


}

    let data = this.repo
    .createQueryBuilder('ndc')
    .select([ 
      'ndc.id',
      'ndc.name'  ,
      'asse.id as asseId' ,
      'asseRslt.id as asseRsltId ',
      'asseRslt.totalEmission '
      ])
    .innerJoinAndMapMany(
      'ndc.assesment',
      Assessment,
      'asse',
      'asse.ndcId = ndc.id and asse.assessmentType = "Ex-post" and asse.isProposal= false',
    )
    .innerJoinAndMapMany(
      'asse.assessmentResult',
      AssessmentResault,
      'asseRslt',
      'asseRslt.assementId = asse.id ',
    )
    .where(filter, {
      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken
    })
    .orderBy('ndc.createdOn', 'ASC'); 


    let resualt = await paginate(data, options);
    // let resualt = await data.getMany();


    if (resualt) {
      return resualt;
    }
  }
}
