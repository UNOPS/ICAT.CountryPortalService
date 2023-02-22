import { AssessmentResault } from 'src/assesment-resault/entity/assessment-resault.entity';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'projectionResualt' })
export class ProjectionResault extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectionYear: number;

  @Column({ default: null })
  baselineResult: number;

  @Column({ default: null })
  baselineResultUnit: string;

  @Column({ default: null })
  projectResult: number;

  @Column({ default: null })
  projectResultUnit: string;

  @Column({ default: null })
  leakageResult: number;

  @Column({ default: null })
  leakageResultUnit: string;

  @Column({ default: null })
  emissionReduction: number;

  @Column({ default: null })
  emissionReductionUnit: string;

  @ManyToOne(
    (type) => AssessmentResault,
    (assesmentResult) => assesmentResult.projectionResult,
  )
  @JoinColumn()
  assementResult: AssessmentResault;

  @Column({ default: null })
  qcStatus: QuAlityCheckStatus;

  @Column({ default: null })
  qcComment: string;

  @Column()
  projectionResualt: number;

  @ManyToOne((type) => Assessment, (assesment) => assesment.projectionResult)
  @JoinColumn()
  assement: Assessment;
}
