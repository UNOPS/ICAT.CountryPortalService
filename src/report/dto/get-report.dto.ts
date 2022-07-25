import { Assessment } from 'src/assesment/entity/assesment.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { Project } from 'src/project/entity/project.entity';

export class GetReportDto {
  // sector: Sector[];
  // ndcList: Ndc[];
  project: Project[];
  assessmentTypeList: any[];
  assessmentYrList: string[];
  reportName: string;
}
