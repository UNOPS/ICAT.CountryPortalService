import { Controller, Get, Query, Request } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Sector } from './sector.entity';
import { SectorService } from './sector.service';

@Crud({
  model: {
    type: Sector,
  },
  query: {
    join: {
      climateChangeDataCategory: {
        eager: true,
      },
      country: {
        eager: true,
      },
      subSector: {
        eager: true,
      },
    },
  },
})
@Controller('sector')
export class SectorController implements CrudController<Sector> {
  constructor(public service: SectorService) {}

  get base(): CrudController<Sector> {
    return this;
  }

  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest,
    @Request() req2,
  ): Promise<GetManyDefaultResponse<Sector> | Sector[]> {
    try {
      let res = await this.base.getManyBase(req);
      // console.log('*********************************************');
      // console.log(res);
      // console.log('*********************************************');
      // console.log(req);
      return res;
    } catch (error) {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      console.log(error);
    }
  }



  @Get(
    'sector/sectorinfo/:page/:limit/:filterText', 
    )
    async getSectorDetails(
      @Request() request,
      @Query('page') page: number,
      @Query('limit') limit: number,
      @Query('filterText') filterText: string,
      
    ): Promise<any> {
      // console.log(moment(editedOn).format('YYYY-MM-DD'))
      return await this.service.getSectorDetails(
        {
          limit: limit,
          page: page,
        },
        filterText,
        
      );
    }
  

    @Get('sector/:countryId')
    async getCountrySector(
      @Request() request,
      @Query('countryId') countryId: number): Promise<any> {
        
  
  console.log("+++++++++++++++++++++++++++",await this.service.getCountrySector(countryId))
      return await this.service.getCountrySector(countryId);
    }


}
