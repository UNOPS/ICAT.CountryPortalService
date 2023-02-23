import { Project } from 'src/project/entity/project.entity';

export class GetReportDto {
  project: Project[];
  assessmentTypeList: any[];
  assessmentYrList: string[];
  reportName: string;
}
