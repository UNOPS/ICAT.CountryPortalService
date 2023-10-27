import { ApiHideProperty } from '@nestjs/swagger';
import { AssessmentResult } from 'src/assessment-result/entity/assessment-result.entity';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { VerificationDetail } from 'src/verification/entity/verification-detail.entity';
import { VerificationStatus } from 'src/verification/entity/verification-status.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'assessmentYear' })
export class AssessmentYear extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assessmentYear: string;

  @Column({ nullable: true })
  qaStatus?: QuAlityCheckStatus;

  @Column({ nullable: true })
  qaDeadline: Date;

  @Column({ nullable: true })
  qaAssighnDate: Date;

  @Column({ nullable: true })
  verificationUser: number;

  @Column({ nullable: true })
  verificationStatus?: VerificationStatus;

  @Column({ nullable: true })
  verificationAssighnDate: Date;

  @Column({ nullable: true })
  verificationDeadline: Date;

  @Column({ nullable: true })
  verifierComment: string;

  @Column({ default: false })
  isVerificationSuccess: boolean;

  @Column({ nullable: true })
  assessmentAssumption: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.assessmentYear, {
    cascade: false,eager: true
  })
  assessment: Assessment;

  @OneToOne(
    () => AssessmentResult,
    (assessmentResult) => assessmentResult.assessmentYear,
  )
  @ApiHideProperty()
  assessmentResult: AssessmentResult;

  @OneToMany(
    () => VerificationDetail,
    (verificationDetail) => verificationDetail.assessmentYear,
  )
  public verificationDetail!: VerificationDetail[];
}
