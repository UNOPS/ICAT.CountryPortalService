import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { AssessmentObjectiveService } from './assessment-objective.service';
import { AssessmentObjective } from './entity/assessment-objective.entity';

@Crud({
  model: {
    type: AssessmentObjective,
  },
  query: {
    join: {
      assessment: {
        eager: true,
      },
    },
  },
})
@Controller('assessment-objective')
export class AssessmentObjectiveController
  implements CrudController<AssessmentObjective>
{
  constructor(public service: AssessmentObjectiveService) {}

  get base(): CrudController<AssessmentObjective> {
    return this;
  }
}
