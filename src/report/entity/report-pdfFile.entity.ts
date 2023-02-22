import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  assesmentType: string;

  @Column()
  generateReportName: string;
}
