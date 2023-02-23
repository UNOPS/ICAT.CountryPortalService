import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { type } from 'os';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { CaActionHistory } from 'src/ca-action-history/entity/ca-action-history.entity';
import { Country } from 'src/country/entity/country.entity';
import { Institution } from 'src/institution/institution.entity';
import { FinancingScheme } from 'src/master-data/financing-scheme/financing-scheme.entity';
import { MitigationActionType } from 'src/master-data/mitigation-action/mitigation-action.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { SubNdc } from 'src/master-data/ndc/sub-ndc.entity';
import { ProjectApprovalStatus } from 'src/master-data/project-approval-status/project-approval-status.entity';
import { ProjectOwner } from 'src/master-data/project-owner/projeect-owner.entity';
import { ProjectStatus } from 'src/master-data/project-status/project-status.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { ReportProject } from 'src/report/entity/report-project.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'climateAction' })
export class Project extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  climateActionName: string;

  @Column({ default: null })
  description: string;

  @Column({ length: 50, default: null, nullable: true })
  contactPersoFullName: string;

  @Column({ length: 30, default: null, nullable: true })
  email: string;

  @Column({ length: 30, default: null, nullable: true })
  contactPersonDesignation: string;

  @Column()
  telephoneNumber: string;

  @Column({ default: null })
  mobileNumber: string;

  @Column({ length: 50, default: null, nullable: true })
  institution: string;

  @ManyToOne((type) => Institution, { cascade: false, nullable: true })
  @JoinColumn()
  mappedInstitution?: Institution;

  @ManyToOne((type) => Country, { cascade: false, eager: true })
  @JoinColumn({ name: 'countryId' })
  country?: Country;

  @ManyToOne((type) => ProjectStatus, { cascade: false })
  @JoinColumn()
  projectStatus?: ProjectStatus;

  @ManyToOne((type) => Sector, { cascade: false, eager: true })
  @JoinColumn()
  sector?: Sector;

  @ManyToOne((type) => Ndc, { cascade: false })
  @JoinColumn()
  ndc?: Ndc;

  @ManyToOne((type) => SubNdc, { cascade: false })
  @JoinColumn()
  subNdc?: SubNdc;

  @Column({ default: null })
  projectScope: string;

  @ManyToOne((type) => ProjectOwner, { cascade: false })
  @JoinColumn()
  projectOwner?: ProjectOwner;

  @OneToMany(() => Assessment, (assessment) => assessment.project)
  assessments: Assessment[];

  @OneToMany(
    () => CaActionHistory,
    (caActionHistory) => caActionHistory.project,
  )
  caActionHistories?: CaActionHistory[];

  @Column({ default: null })
  acceptedDate: Date;

  @Column()
  proposeDateofCommence: Date;

  @Column({ default: 0 })
  duration: number;

  @Column({ default: 0 })
  baseScenarioProjectLife: number;

  @Column({ default: 0 })
  projectScenarioTotalInvestment: number;

  @Column({ default: 0 })
  baseScenarioTotalInvestment: number;

  @Column({ length: 500, default: null, nullable: true })
  objective: string;

  @Column({ default: null, nullable: true })
  subNationalLevl1: string;

  @Column({ default: null, nullable: true })
  subNationalLevl2: string;

  @Column({ default: null })
  subNationalLevl3: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    default: 0,
    nullable: true,
  })
  longitude: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    default: 0,
    nullable: true,
  })
  latitude: number;

  @Column({ length: 500, default: null, nullable: true })
  outcome: string;

  @Column({ length: 500, default: null, nullable: true })
  currentProgress: string;

  @Column({ default: null, nullable: true })
  chgEmissions: string;

  @Column({ length: 500, default: null, nullable: true })
  adaptationBenefits: string;

  @Column({ length: 500, default: null })
  directSDBenefit: string;

  @Column({ length: 500, default: null })
  indirectSDBenefit: string;

  @Column({ default: null })
  implementingEntity: string;

  @Column({ default: null })
  executingEntity: string;

  @Column({ length: 300, default: null })
  partiesInvolved?: string;

  @Column({ length: 300, default: null })
  beneficiaries: string;

  @Column({ default: null })
  isMappedCorrectly: number;

  @ManyToOne((type) => FinancingScheme, {
    cascade: false,
  })
  @JoinColumn()
  financingScheme?: FinancingScheme;

  @Column({ length: 100, default: null })
  donors: string;

  @Column({ length: 100, default: null })
  investors: string;

  @Column({ length: 300, default: null })
  fundingOrganization: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  initialInvestment?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  annualFunding?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  annualRevenue?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  expectedRecurrentExpenditure;

  @ManyToOne((type) => MitigationActionType, { cascade: false })
  @JoinColumn()
  mitigationActionType?: MitigationActionType;

  @ManyToOne((type) => ProjectApprovalStatus, { cascade: false })
  @JoinColumn()
  projectApprovalStatus?: ProjectApprovalStatus;

  @Column({ default: null })
  projectRejectComment: string;

  @Column({ default: null })
  projectDataRequsetComment: string;

  @Column()
  endDateofCommence: Date;

  @Column({ default: null, nullable: true })
  methodology: string;

  @Column({ default: null, nullable: true })
  gdp: string;

  @Column({ default: null, nullable: true })
  assumption: string;

  @OneToMany(() => ReportProject, (reportProject) => reportProject.project, {
    nullable: true,
  })
  public reportProject!: ReportProject[];

  @Column({ default: null })
  currentNdc: string;

  @Column({ default: null })
  previousNdc: string;

  @Column({ default: null })
  currentSubNdc: string;

  @Column({ default: null })
  previousSubNdc: string;

  @Column({ default: null })
  likelyhood: number;

  @Column({ default: null })
  politicalPreference: number;

  @Column({ default: null })
  financialFecialbility: number;

  @Column({ default: null })
  availabilityOfTechnology: number;

  @Column({ default: null })
  actionJustification: string;
}
