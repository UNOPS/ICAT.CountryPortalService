import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ProjectOwnerService } from './project-owner.service';
import { ProjectOwner } from './projeect-owner.entity';

@Crud({
  model: {
    type: ProjectOwner,
  },
})
@Controller('project-owner')
export class ProjectOwnerController implements CrudController<ProjectOwner> {
  constructor(public service: ProjectOwnerService) {}
}
