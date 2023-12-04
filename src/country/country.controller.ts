import { Controller, Request } from '@nestjs/common';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { TokenDetails } from 'src/utills/token_details';
import { CountryService } from './country.service';
import { Country } from './entity/country.entity';

@Crud({
  model: {
    type: Country,
  },
  query: {
    join: {
      sector: {
        eager: true,
      },
    },
  },
})

@Controller('country')
export class CountryController implements CrudController<Country>{
  constructor(
    public service: CountryService,
    private readonly tokenDetails: TokenDetails
  ) { }


  get base(): CrudController<Country> {
    return this;
  }

  @Override()
  async updateOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Country,
  ) {
    return await this.base.updateOneBase(req, dto);
  }
}
