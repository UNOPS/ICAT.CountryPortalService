import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ProjectApprovalStatus } from './project-approval-status.entity';
import { ProjectApprovalStatusService } from './project-approval-status.service';

@Crud({
  model: {
    type: ProjectApprovalStatus,
  },
  query: {
    join: {
      //   subNdc: {
      //     eager: true,
      //   },
    },
  },
})
@Controller('project-approval-status')
export class ProjectApprovalStatusController
  implements CrudController<ProjectApprovalStatus>
{
  constructor(public service: ProjectApprovalStatusService) {}

  get base(): CrudController<ProjectApprovalStatus> {
    return this;
  }
}
