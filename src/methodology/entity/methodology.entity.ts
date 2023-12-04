import { Assessment } from 'src/assessment/entity/assessment.entity';
import { Country } from 'src/country/entity/country.entity';
import { ApplicabilityEntity } from 'src/master-data/applicability/entity/applicability.entity';

import { MitigationActionType } from 'src/master-data/mitigation-action/mitigation-action.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { SubNdc } from 'src/master-data/ndc/sub-ndc.entity';
import { SubsectionEntity } from 'src/master-data/subsection/entity/subsection.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MethodologyData } from 'src/master-data/methodology-data/methodology-data.entity';

@Entity({ name: 'methodology' })
export class Methodology extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  version: string;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  displayName: string;

  @Column({ default: null })
  developedBy: string;

  @Column({ default: null })
  parentId: number;

  @Column({ default: null })
  applicableSector: string;

  @Column({ default: null })
  documents: string;

  @Column({ default: 0 })
  isActive: number;

  @Column({ default: null })
  baselineImage: string;

  @Column({ default: null })
  projectImage: string;

  @Column({ default: null })
  projectionImage: string;

  @Column({ default: null })
  leakageImage: string;

  @Column({ default: null })
  resultImage: string;

  @Column({ default: null })
  easenessOfDataCollection: string;

  @Column({ default: null })
  uniqueIdentification: string;

  @Column({ default: null })
  transportSubSector: string;

  @Column({ default: null })
  upstream_downstream: string;

  @Column({ default: null })
  ghgIncluded: string;

  @ManyToOne((type) => Country, { cascade: false })
  @JoinColumn({ name: 'countryId' })
  country?: Country;

  @OneToMany(() => Assessment, (assessment) => assessment.methodology)
  assessments: Assessment[];

  @ManyToOne((type) => Sector, { cascade: false })
  @JoinColumn({ name: 'sectorId' })
  sector?: Sector;

  @ManyToOne((type) => MitigationActionType, { cascade: false })
  @JoinColumn({ name: 'mitigationActionTypeId' })
  mitigationActionType?: MitigationActionType;

  @ManyToOne((type) => ApplicabilityEntity, { cascade: false })
  @JoinColumn({ name: 'applicabilityId' })
  applicability: ApplicabilityEntity;

  @ManyToMany((type) => Ndc, {
    eager: true,
    cascade: false,
  })
  @JoinTable({ name: 'methodology_ndc' })
  ndc?: Ndc[];

  @ManyToMany((type) => SubNdc, {
    eager: true,
    cascade: false,
  })
  @JoinTable({ name: 'methodology_subndc' })
  subNdc?: SubNdc[];

  @OneToMany(
    () => SubsectionEntity,
    (methodologySubsection) => methodologySubsection.methodology,
  )
  methodologySubsection: SubsectionEntity[];

  @ManyToOne((type) => MethodologyData, { cascade: false })
  @JoinColumn({ name: 'methodId' })
  method?: MethodologyData;
}
