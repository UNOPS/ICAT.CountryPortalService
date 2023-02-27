import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { SubNdc } from './sub-ndc.entity';
import { SubNdcService } from './sub-ndc.service';

@Crud({
  model: {
    type: SubNdc,
  },
  query: {
    join: {
      ndc: {
        eager: true,
      },
    },
  },
})
@Controller('sub-ndc')
export class SubNdcController implements CrudController<SubNdc> {
  constructor(public service: SubNdcService) {}

  get base(): CrudController<SubNdc> {
    return this;
  }
}
