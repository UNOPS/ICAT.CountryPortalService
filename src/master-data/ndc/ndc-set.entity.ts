import { Country } from 'src/country/entity/country.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class NdcSet extends MasterData {
  @ManyToOne((type) => Country)
  @JoinColumn()
  country: Country;

  @Column()
  submissionDate: Date;
}
