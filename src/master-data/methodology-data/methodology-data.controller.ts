import { Controller } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import { MethodologyData } from "./methodology-data.entity";
import { MethodologyDataService } from "./methodology-data.service";

@Crud({
    model: {
      type: MethodologyData,
    },
    query: {
        join: {
          country: {
            eager: true,
          },
          mitigationActionType: {
            eager: true,
          },
          applicability: {
            eager: true,
          },
          sector: {
            eager: true,
          },
      },
  },
  })
  @Controller('methodology-data')
  export class MethodologyDataController
  implements CrudController<MethodologyData>
  {
    constructor(public service: MethodologyDataService) {}

    
  }