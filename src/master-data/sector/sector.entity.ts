import { CountrySector } from 'src/country/entity/country-sector.entity';
import { LearningMaterialSector } from 'src/learning-material/entity/learning-material-sector.entity';
import { ReportSector } from 'src/report/entity/report-sector.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SubSector } from '../sub-sector/entity/sub-sector.entity';

@Entity({ name: 'sector' })
export class Sector extends BaseTrackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ length: 300, default: null })
  description: string;

  @Column({ default: 1 })
  sortOrder: number;

  @OneToMany(() => CountrySector, (countrySector) => countrySector.sector)
  public countrysector!: CountrySector[];

  @OneToMany(
    () => LearningMaterialSector,
    (learningMaterialSector) => learningMaterialSector.sector,
  )
  public learningMaterialsector!: LearningMaterialSector[];

  @OneToMany(() => ReportSector, (reportSector) => reportSector.sector, {
    nullable: true,
  })
  public reportSector!: ReportSector[];

  @OneToMany(() => SubSector, (subSector) => subSector.sector)
  public subSector!: SubSector[];

  @Column()
  emissionSummary: string;

  @Column()
  ndcDocuments: string;

  @Column({ default: null })
  uniqueIdentification: string;
}
