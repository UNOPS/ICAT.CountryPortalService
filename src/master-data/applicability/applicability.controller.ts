import { Controller, Get, Request } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ApplicabilityService } from './applicability.service';
import { ApplicabilityEntity } from './entity/applicability.entity';

@Crud({
  model: {
    type: ApplicabilityEntity,
  },
  query: {
    join: {
      Methodology: {
        eager: true,
      },
    },
  },
})
@Controller('applicability')
export class ApplicabilityController
  implements CrudController<ApplicabilityEntity>
{
  constructor(public service: ApplicabilityService) {}

  get base(): CrudController<ApplicabilityEntity> {
    return this;
  }

  @Get('appplicability/byMitigationActions')
  async getApplicability(@Request() request): Promise<any> {
    return await this.service.getApplicability();
  }
}
