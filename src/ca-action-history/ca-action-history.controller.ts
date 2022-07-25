import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { CaActionHistoryService } from './ca-action-history.service';
import { CaActionHistory } from './entity/ca-action-history.entity';


@Crud({
    model: {
      type: CaActionHistory,
    },
    query: {
        join: {
            project: {
              eager: true,
            },
           
          },
    },
  })

@Controller('ca-action-history')
export class CaActionHistoryController implements CrudController<CaActionHistory> {

    constructor(public service: CaActionHistoryService) {

    }
    
      get base(): CrudController<CaActionHistory> {
        return this;
      }

}
