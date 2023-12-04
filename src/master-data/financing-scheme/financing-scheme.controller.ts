import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { FinancingScheme } from './financing-scheme.entity';
import { FinancingSchemeService } from './financing-scheme.service';

@Crud({
  model: {
    type: FinancingScheme,
  },
})
@Controller('financing-scheme')
export class FinancingSchemeController
  implements CrudController<FinancingScheme>
{
  constructor(public service: FinancingSchemeService) {}
}
