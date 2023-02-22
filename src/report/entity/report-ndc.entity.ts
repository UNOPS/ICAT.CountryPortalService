import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from './report.entity';

@Entity({ name: 'reportNdc' })
export class ReportNdc extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Report, (report) => report.reportNdc)
  public report!: Report;

  @ManyToOne(() => Ndc, (ndc) => ndc.reportNdc)
  public ndc!: Ndc;
}
