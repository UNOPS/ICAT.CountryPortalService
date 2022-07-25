import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { EmissionReductioDraftDataEntity } from './entity/emission-reductio-draft-data.entity';

@Injectable()
export class EmissionReductionDraftdataService extends TypeOrmCrudService<EmissionReductioDraftDataEntity> {
    constructor(@InjectRepository(EmissionReductioDraftDataEntity) repo: Repository<EmissionReductioDraftDataEntity>,
    // @Inject(REQUEST) private request,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    
    ) {
        super(repo);
      }


      async getEmissionEeductionDraftDataForCountry(
       
        countryIdFromTocken:number ,
        sectorIdFromTocken:number 
      ): Promise<EmissionReductioDraftDataEntity> {
        // console.log("user11111",this.request.user)
        
        // const countryId = this.request.user.user.countryId;
        // console.log("context",countryId)


        let filter: string = '';
        if (countryIdFromTocken != 0) {
          // console.log('countryIdFromTocken1111',countryIdFromTocken)
          if (filter) {
            filter = `${filter}  and ert.countryId = :countryIdFromTocken`;
          } else {
            filter = `ert.countryId = :countryIdFromTocken`;
          }
        }
    
    if(sectorIdFromTocken){ 
      // console.log('sectorIdFromTocken111',sectorIdFromTocken)
      if (filter) {
        filter = `${filter}  and ert.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `ert.sectorId = :sectorIdFromTocken`; 
    }
  }else{

    if (filter) {
      filter = `${filter}  and ert.sectorId is  null `;
    } else {
      filter = `ert.sectorId is  null`; 
  }

  }
    
     
    
        let data = this.repo
          .createQueryBuilder('ert')
          .where(filter, { countryIdFromTocken,sectorIdFromTocken })
          .orderBy('id', 'ASC');
         
        console.log(
          '=====================================================================',
        );
        //console.log(data.getQuery());
        let resualt = await data.getOne();

        if(sectorIdFromTocken && !resualt){
          return this.getEmissionEeductionDraftDataForCountry(countryIdFromTocken,undefined)
        }
        
        // let resualt = await this.repo.findOne(countryIdFromTocken);
    console.log("emission",resualt)
        if (resualt) {
          // console.log("emission",resualt)
          return resualt;
        }
      }


      
    
}
