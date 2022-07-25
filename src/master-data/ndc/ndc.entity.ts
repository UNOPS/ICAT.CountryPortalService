import { Assessment } from 'src/assesment/entity/assesment.entity';
import { Country } from 'src/country/entity/country.entity';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { ReportNdc } from 'src/report/entity/report-ndc.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import { Entity, ManyToOne, JoinColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { Sector } from '../sector/sector.entity';
import { NdcSet } from './ndc-set.entity';
import { SubNdc } from './sub-ndc.entity';

@Entity()
export class Ndc extends MasterData {
  @OneToMany(() => SubNdc, (subNdc) => subNdc.ndc, {
    cascade: false,
  })
  // @JoinTable()
  subNdc: SubNdc[];

  @ManyToOne((type) => NdcSet, { cascade: false })
  // @JoinColumn()
  set: NdcSet;

  @ManyToOne((type) => Country, { cascade: false })
  // @JoinColumn()
  country: Country;

  @ManyToOne((type) => Sector, { cascade: false })
  // @JoinColumn()
  sector: Sector;

  @OneToMany(() => Assessment, assessment => assessment.ndc)
    assessments: Assessment[];

  isSelected: boolean;

  @ManyToMany((type) => Methodology, { cascade: false })
    @JoinTable({ name: 'methodology_ndc' })
    methodology: Methodology;

  @OneToMany(() => ReportNdc,(reportNdc) => reportNdc.ndc ,{nullable: true})
    public reportNdc!: ReportNdc[];
  
}
