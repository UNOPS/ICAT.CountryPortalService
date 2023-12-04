import { Controller, Get, Query, Request } from '@nestjs/common';
import { CrudController } from '@nestjsx/crud';
import { ParameterHistory } from './entity/parameter-history.entity';
import { ParameterHistoryService } from './parameter-history.service';

@Controller('parameter-history')
export class ParameterHistoryController
  implements CrudController<ParameterHistory>
{
  constructor(public service: ParameterHistoryService) {}

  @Get('parameterhistory/getparameters/:id/')
  async getHistroyByid(
    @Request() request,
    @Query('id') id: number,
  ): Promise<any> {
    return await this.service.getHistory(id);
  }
}
