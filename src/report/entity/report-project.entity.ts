import { Project } from 'src/project/entity/project.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from './report.entity';

@Entity({ name: 'reportProject' })
export class ReportProject extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Report, (report) => report.reportProject)
  public report!: Report;

  @ManyToOne(() => Project, (project) => project.reportProject)
  public project!: Project;
}
