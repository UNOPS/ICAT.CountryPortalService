import { AssessmentResult } from 'src/assessment-result/entity/assessment-result.entity';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Project } from 'src/project/entity/project.entity';

export class ReportResponseDto {
  sector: Sector[] = [];
  ndc: Ndc[] = [];
  project: Project[] = [];
  assessment: Assessment[] = [];
  assessmentYr: AssessmentYear[] = [];
  assessmentParamater: Parameter[] = [];
  result: AssessmentResult[] = [];
  reportName: string;
}
