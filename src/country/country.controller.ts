import { Controller, Get, Query, UseGuards ,Request} from '@nestjs/common';
import { Crud, CrudController, ParsedBody } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
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
    private readonly tokenDetails: TokenDetails,) { }


  get base(): CrudController<Country> {
    return this;
  }


  // @UseGuards(JwtAuthGuard)


}
