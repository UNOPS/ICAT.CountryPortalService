import { Assessment } from 'src/assesment/entity/assesment.entity';
import { Country } from 'src/country/entity/country.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { DefaultValue } from 'src/default-value/entity/defaultValue.entity';
import { Institution } from 'src/institution/institution.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { VerificationDetail } from 'src/verification/entity/verification-detail.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VerifierAcceptance } from '../enum/verifier-acceptance.enum';
import { ParameterHistory } from 'src/parameter-history/entity/parameter-history.entity';

@Entity({ name: 'parameter' })
export class Parameter extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  originalName: string;

  @Column({ nullable: true })
  isAlternative: boolean;


  @Column({ default: false })
  isEnabledAlternative:boolean;

  @Column({ nullable: true })
  canActiveAction:boolean
  // @ManyToOne((type) => Parameter, {
  //   cascade: false,
  //   onDelete: 'RESTRICT',
  //   onUpdate: 'RESTRICT',
  //   nullable: true,
  // })
  @JoinColumn({ name: 'ParentParameterId' })
  ParentParameter?: Parameter;
  

  @Column({ nullable: true })
  ParentParameterId?: number;

  @Column({ nullable: true })
  isBaseline: boolean;

  @Column({ nullable: true })
  isProject: boolean;

  @Column({ nullable: true })
  isLekage: boolean;

  @Column({ nullable: true })
  isProjection: boolean;

  @Column({ nullable: true })
  isDefault: boolean;

  @Column({nullable: true})
  isHistorical: boolean;

  @Column({nullable: true})
  historicalParaID: number;

  @Column({ nullable: true })
  vehical?: string;

  @Column({ nullable: true })
  fuelType?: string;

  @Column({ nullable: true })
  route?: string;

  @Column({ nullable: true })
  powerPlant?: string;

  @Column({ nullable: true })
  feedstock?: string;

  @Column({ nullable: true })
  soil?: string;

  @Column({ nullable: true })
  stratum?: string;

  @Column({ nullable: true })
  residue?: string;

  @Column({ nullable: true })
  landClearance?: string;

  @Column({ nullable: true })
  uomDataRequest?: string;

  @Column({ nullable: true })
  uomDataEntry?: string;

  @Column({ nullable: true })
  value?: string;

  @Column({ nullable: true })
  conversionValue?: string;

  @Column({ default: null })
  baseYear: number;

  @Column({ nullable: true })
  projectionBaseYear: number;

  @Column({ default: null })
  useDefaultValue: boolean;

  @Column({ nullable: true })
  AssessmentYear: number;

  @Column({ nullable: true })
  projectionYear: number;

  @Column({ default: null })
  code: string;

  @Column({ default: null })
  enterDataAssumption: string;

  @Column({ nullable: true })
  methodologyCode: string;

  @Column({ nullable: true })
  methodologyVersion: string;

  @Column({ default: null })
  countryCodeExtended: string;

  @Column({ nullable: true })
  isAcceptedByVerifier: number;
  
  @Column({ nullable: true })
  defaultValueId: number;
  

  @ManyToOne((type) => Institution, {
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: true,
    eager: true
  })
  // @JoinColumn({ name: 'institutionId' })
  institution?: Institution;

  @ManyToOne(() => Assessment, (assessment) => assessment.parameters, {
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn()
  assessment?: Assessment;

  @ManyToOne((type) => DefaultValue, {
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: true,
    eager: true
  })
  // @JoinColumn({ name: 'AssessmentId' })
  defaultValue?: DefaultValue;

  // @OneToOne((type) => Parameter, { cascade: false, onUpdate: 'RESTRICT' })
  // @JoinColumn()
  parameterRequest?: ParameterRequest;

  @OneToMany(() => VerificationDetail,(verificationDetail) => verificationDetail.parameter)
  public verificationDetail: VerificationDetail[];



  // @OneToOne((type) => DefaultValue,{ nullable: true })
  // @JoinColumn()
  // defaultValue?: DefaultValue

  // @Column({ nullable: true })
  // defaultValueId: number;

  @Column({ default: false })
  hasChild: boolean;

  @Column({default: VerifierAcceptance.PENDING})
  verifierAcceptance: VerifierAcceptance

  @Column({nullable: true})
  verifierConcern: string

  @Column({ nullable: true })
  previouseParameterId: number;


}