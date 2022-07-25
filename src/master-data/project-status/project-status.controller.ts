import { Controller } from '@nestjs/common';
import { Request, Post, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  Override,
  ParsedBody,
  ParsedRequest,
  CrudRequest,
  GetManyDefaultResponse,
} from '@nestjsx/crud';
import { ProjectStatus } from './project-status.entity';
import { ProjectStatusService } from './project-status.service';

@Crud({
  model: {
    type: ProjectStatus,
  },
  query: {
    join: {
      //   subNdc: {
      //     eager: true,
      //   },
    },
  },
})
@Controller('project-status')
export class ProjectStatusController implements CrudController<ProjectStatus> {
  constructor(public service: ProjectStatusService) {}

  get base(): CrudController<ProjectStatus> {
    return this;
  }

  //   @Override()
  //   async getMany(
  //     @ParsedRequest() req: CrudRequest,
  //     @Request() req2,
  //   ): Promise<GetManyDefaultResponse<Ndc> | Ndc[]> {
  //     try {
  //       console.log('*********************************************');
  //       console.log(req);

  //       let res = await this.base.getManyBase(req);
  //       console.log('*********************************************');
  //       console.log(res);
  //       return res;
  //     } catch (error) {
  //       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //       console.log(error);
  //     }
  //   }
}
