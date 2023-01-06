import { Assessment } from "src/assesment/entity/assesment.entity";
import { Country } from "src/country/entity/country.entity";
import { MasterData } from "src/shared/entities/master.data.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class NdcSet extends MasterData {
    
  @ManyToOne((type) => Country)
  @JoinColumn()
  country: Country;

  

  
  @Column()
  submissionDate: Date;
}
