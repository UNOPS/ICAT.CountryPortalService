import { MasterData } from 'src/shared/entities/master.data.entity';
import { Entity, JoinTable, OneToMany } from 'typeorm';
import { Sector } from '../sector/sector.entity';

@Entity()
export class ClimateChangeDataCategory extends MasterData {
  // @OneToMany((type) => Sector, (s) => s.climateChangeDataCategory, {
  //   eager: true,
  // })
  // @JoinTable()
  // sectors: Sector[];
}
