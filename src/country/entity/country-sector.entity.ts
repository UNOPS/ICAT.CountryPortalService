import {Sector} from "src/master-data/sector/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";

@Entity({ name: 'country_sector' })
export class CountrySector extends BaseTrackingEntity {

    constructor() {
        super();
        this.createdBy = '';
        this.editedBy = '';
      }
 
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(() => Country, country => country.countrysector,{cascade:false})
    // public country: Country;

    @ManyToOne(type => Country)
    @JoinColumn({ name: "countryId" })
    country:Country;

    @ManyToOne(() => Sector, sector => sector.countrysector,{cascade:false})
    public sector: Sector;

    // @Column("countryId")
    // countryId:number;

    @Column("sectorId")
    sectorId:number;
    		 	
    @Column({ default: null })
    uniqueIdentification: string;

}
