import { Country } from 'src/country/entity/country.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import { Column, Double, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Sector } from '../../sector/sector.entity';

@Entity({ name: 'EmissionReductionDraftData' })
export class EmissionReductioDraftDataEntity extends MasterData {
  @ManyToOne((type) => Country, { cascade: false })
  @JoinColumn()
  country: Country;

  @ManyToOne((type) => Sector, { cascade: false, nullable: true })
  sector?: Sector;

  @Column()
  baseYear: string;

  @Column({type :"double" })
  baseYearEmission: number;

  @Column()
  targetYear: string;

  @Column({type :"double" })
  targetYearEmission: number;

  @Column({ default: null,type :"double" })
  unconditionaltco2: number;

  @Column({ default: null,type :"double" })
  conditionaltco2: number;
}
