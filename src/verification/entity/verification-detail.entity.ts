import { Assessment } from 'src/assesment/entity/assesment.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { VerificationStatus } from './verification-status.entity';

@Entity({ name: 'verificationDetail' })
export class VerificationDetail extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
    this.isAccepted = false;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column()
  assessmentId: number;

  @Column({ nullable: true })
  updatedDate: Date;

  @Column({ nullable: true })
  rootCause?: string;

  @Column({ nullable: true })
  explanation?: string;

  @Column({ nullable: true })
  correctiveAction?: string;

  @Column({ nullable: true })
  action?: string;

  @Column({ nullable: false })
  isAccepted: boolean;

  @Column({ default: false })
  isNDC: boolean;

  @Column({ default: false })
  isMethodology: boolean;

  @Column({ default: false })
  isBaseline: boolean;

  @Column({ default: false })
  isProject: boolean;

  @Column({ default: false })
  isLekage: boolean;

  @Column({ default: false })
  isProjection: boolean;

  @Column({ default: false })
  isResult: boolean;

  @Column({ default: false })
  isDataRequested: boolean;

  @Column({ nullable: true })
  verificationStatus: VerificationStatus;

  @Column({ default: 1 })
  verificationStage: number;

  @Column({ nullable: true })
  userVerifier?: number;

  // @Column({ nullable: true })
  // verifierName?: string;

  // @Column({ nullable: true })
  // institutionName?: string;
  @Column({ nullable: true })
  isAssumption: boolean;

  @Column({ nullable: true })
  assumption: string;

  @ManyToOne(
    () => AssessmentYear,
    (assessmentYear) => assessmentYear.verificationDetail,
  )
  public assessmentYear!: AssessmentYear;

  @ManyToOne(() => Parameter, (parameter) => parameter.verificationDetail,{nullable: true})
  public parameter: Parameter;
}
