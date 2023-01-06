import { Controller } from '@nestjs/common';
import { CreateManyDto, Crud, CrudController, CrudRequest, CrudService, GetManyDefaultResponse } from '@nestjsx/crud';
import { NdcSet } from './ndc-set.entity';
import { NdcSetService } from './ndc-set.service';


@Crud({
    model: {
      type: NdcSet,
    },
    query: {
      join: {
          country: {
            eager: true,
          },
      },
    },
  })
@Controller('ndc-set')
export class NdcSetController implements CrudController<NdcSet>{
    constructor(public service: NdcSetService) {}

    get base(): CrudController<NdcSet> {
        return this;
      }
}
