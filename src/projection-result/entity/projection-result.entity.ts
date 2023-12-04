import { AssessmentResult } from 'src/assessment-result/entity/assessment-result.entity';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'projectionResult' })
export class ProjectionResult extends BaseTrackingEntity {
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
    (type) => AssessmentResult,
    (assessmentResult) => assessmentResult.projectionResult,
  )
  @JoinColumn()
  assessmentResult: AssessmentResult;

  @Column({ default: null })
  qcStatus: QuAlityCheckStatus;

  @Column({ default: null })
  qcComment: string;

  @Column()
  projectionResult: number;

  @ManyToOne((type) => Assessment, (assessment) => assessment.projectionResult)
  @JoinColumn()
  assessment: Assessment;
}
