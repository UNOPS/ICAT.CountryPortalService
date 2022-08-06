import { Body, Controller, Get, Post, Query ,Request, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { DefaultValueService } from './default-value.service';
import { defaultValueDtos } from './dto/defaultValue.dto';
import { DefaultValue } from './entity/defaultValue.entity';

@Crud({
  model: {
    type: DefaultValue,
  },
  query: {
    join: {
      country: {
        eager: true,
      },
    }
  },
})
@Controller('default-value')
export class DefaultValueController implements CrudController<DefaultValue> {
  constructor(public service: DefaultValueService,
    private readonly tokenDetails:TokenDetails,
    ) {}


  get base(): CrudController<DefaultValue> {
    return this;
  }

  @Post('defaultValuex')
  async sendDefaultValue(@Body() defaultDto: defaultValueDtos): Promise<any> {
    //console.log("my default  values...",defaultDto)
    const res = await this.service.sendDefaultValue(defaultDto);
    return res;
  }

  @Post('update')
  async createValue(@Body() val:DefaultValue):Promise<any>{
    let def = new DefaultValue();
    def.parameterName = val.parameterName;
    def.administrationLevel =val.administrationLevel;
    await this.service.createValue(def);
  }

  @UseGuards(JwtAuthGuard)
  @Get(
    'Defaultvalues/info/:page/:limit/:filterText/:source/:year/:status',
  )
  async getDefaultvalueInfo(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('source') source: string,
    @Query('year') year: string,
    @Query('status') status: string,
  ): Promise<any> {
    // console.log("heelo controler");

    let countryIdFromTocken:number;
   // let sectorIdFromTocken:number;

    [countryIdFromTocken]=    this.tokenDetails.getDetails([TokenReqestType.countryId])


    return await this.service.getDefaultvalueInfo(
      {
        limit: limit,
        page: page,
      },
      filterText,
      source,
      year,
      status,
      countryIdFromTocken,
    );
  }



}
