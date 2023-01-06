import { Controller, Get, Query, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController } from '@nestjsx/crud';
// import { request } from 'express';
import { Repository } from 'typeorm-next';
import { InstitutionTypeService } from './institution-type.service';
import { InstitutionType } from './institution.type.entity';

@Crud({
    model: {
        type: InstitutionType,
    },
    query: {
        join: {
        institution: {
            eager: true,
         },
        },
    },
})

@Controller('institution-type')
export class InstitutionTypeController implements CrudController<InstitutionType>{
    constructor(public service: InstitutionTypeService,
        @InjectRepository(InstitutionType)
        private readonly institutionTypeRepository: Repository<InstitutionType>){}


// @Get('allInstitutionTypes')
// async findAllTypesByUserType(
//     @Request() request,
//     @Query('userId') userTypeId: number,
// ): Promise<InstitutionType[]>{
     
//     let typeList = await this.institutionTypeRepository.find({
//         where: { loggedUserType:userTypeId }
//     });
//     return typeList;
// // }
// }

@Get('institutionTypeByUserType')
async findInstitutionTypeByUserType(
    @Query('userId') userId: number,
): Promise<any>{
    return await this.service
    .getInstitutionTypesByUser(userId)
}
}
