import { AssessmentResult } from 'src/assessment-result/entity/assessment-result.entity';
import { AssessmentObjective } from 'src/assessment-objective/entity/assessment-objective.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { Country } from 'src/country/entity/country.entity';
import { ApplicabilityEntity } from 'src/master-data/applicability/entity/applicability.entity';
import { MitigationActionType } from 'src/master-data/mitigation-action/mitigation-action.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { SubNdc } from 'src/master-data/ndc/sub-ndc.entity';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Project } from 'src/project/entity/project.entity';
import { ProjectionResult } from 'src/projection-result/entity/projection-result.entity';
import { ProjectionYear } from 'src/projection-year/entity/projection-year.entity';
import { ReportAssessment } from 'src/report/entity/report-assessment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { AssessmentStatus } from './assessment-status.entity';

@Entity({ name: 'assessment' })
export class Assessment extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  baseYear: number;

  @Column({ nullable: true })
  projectStartDate: Date;

  @Column({ nullable: true })
  projectDuration: number;

  @Column({ nullable: true })
  ghgAssessTypeForMac: string;

  @Column({ default: 0 })
  assessmentStatus: AssessmentStatus;

  @Column({ nullable: true })
  assessmentType: string;

  @Column({ nullable: true })
  emmisionReductionValue: number;

  @Column({ nullable: true })
  macValue: number;

  @Column({type:'text', nullable: true })
  baselineScenario: string;

  @Column({type:'text', nullable: true })
  projectScenario: string;

  @Column({ nullable: true })
  isGuided: boolean;

  @Column({ nullable: true })
  isProposal: boolean;

  @Column({ nullable: true })
  lekageScenario: string;

  @Column({ nullable: true })
  projectionIndicator: string;

  @Column({ nullable: true })
  projectionBaseYear: number;

  @Column({ nullable: true })
  easyOfUseDataCollection: string;

  @Column({ nullable: true })
  methodologyCode: string;

  @Column({ nullable: true })
  methodologyVersion: string;

  @ManyToOne((type) => Country, { cascade: false, nullable: true, eager: true })
  country?: Country;

  @ManyToOne(() => Methodology, (methodology) => methodology.assessments, {
    cascade: false,
    nullable: true,
  })
  methodology: Methodology;

  @ManyToOne(() => User, { cascade: false, nullable: true })
  user: User;

  @ManyToOne(() => Project, (project) => project.assessments, {
    cascade: false,
    nullable: true,
    eager: true,
  })
  project: Project;

  @ManyToMany(() => AssessmentObjective, {
    cascade: false,
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinTable()
  assessmentObjective: AssessmentObjective[];

  @OneToMany(
    () => AssessmentYear,
    (assessmentYear) => assessmentYear.assessment,
    {
      cascade: false,
      nullable: true,
    },
  )
  assessmentYear: AssessmentYear[];

  @OneToMany(
    () => AssessmentResult,
    (assessmentResult) => assessmentResult.assessment,
    { cascade: false, nullable: true },
  )
  assessmentResult: AssessmentResult[];

  @ManyToOne(() => MitigationActionType, { cascade: false, nullable: true })
  mitigationActionType: MitigationActionType;

  @ManyToOne(() => Ndc, { cascade: false, nullable: true })
  @JoinColumn()
  ndc: Ndc;

  @ManyToOne(() => SubNdc, { cascade: false, nullable: true })
  @JoinColumn()
  subNdc: SubNdc;

  @OneToMany(() => Parameter, (as) => as.assessment, {
    cascade: false,
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  parameters: Parameter[];

  @OneToMany(() => ProjectionYear, (pe) => pe.assessment, {
    cascade: false,
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn()
  projectionYear: ProjectionYear[];

  @ManyToMany((type) => ApplicabilityEntity, { cascade: false, nullable: true })
  @JoinTable()
  applicability?: ApplicabilityEntity[];

  @OneToMany(
    () => ReportAssessment,
    (reportAssessment) => reportAssessment.assessment,
    { nullable: true },
  )
  public reportAssessment!: ReportAssessment[];

  @OneToMany(
    () => ProjectionResult,
    (projectiondata) => projectiondata.assessment,
  )
  projectionResult: ProjectionResult[];
}
