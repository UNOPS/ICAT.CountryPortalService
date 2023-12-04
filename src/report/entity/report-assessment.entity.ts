import { Assessment } from 'src/assessment/entity/assessment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from './report.entity';

@Entity({ name: 'report_assessment' })
export class ReportAssessment extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Report, (report) => report.reportAssessment)
  public report!: Report;

  @ManyToOne(() => Assessment, (assessment) => assessment.reportAssessment)
  public assessment!: Assessment;
}
