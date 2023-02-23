import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ReportPdfFileData extends BaseTrackingEntity {
  constructor() {
    super();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sectorName: string;

  @Column()
  ndcName: string;

  @Column()
  climateAction: string;

  @Column()
  reportName: string;

  @Column()
  countryId: number;

  @Column({ default: null })
  assessmentType: string;

  @Column()
  generateReportName: string;
}
