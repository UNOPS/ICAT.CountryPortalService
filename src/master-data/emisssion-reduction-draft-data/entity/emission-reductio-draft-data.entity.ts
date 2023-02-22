import { Country } from 'src/country/entity/country.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Sector } from '../../sector/sector.entity';

@Entity({ name: 'EmissionReductionDraftData' })
export class EmissionReductioDraftDataEntity extends MasterData {
  @ManyToOne((type) => Country, { cascade: false })
  @JoinColumn()
  country: Country;

  @ManyToOne((type) => Sector, { cascade: false, nullable: true })
  // @JoinColumn()
  sector?: Sector;

  @Column()
  baseYear: string;

  @Column()
  baseYearEmission: number;

  @Column()
  targetYear: string;

  @Column()
  targetYearEmission: number;

  @Column({ default: null })
  unconditionaltco2: number;

  @Column({ default: null })
  conditionaltco2: number;
}
