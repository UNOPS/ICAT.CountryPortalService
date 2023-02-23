import { Sector } from 'src/master-data/sector/sector.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './country.entity';

@Entity({ name: 'country_sector' })
export class CountrySector extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Country, (country) => country.countrysector)
  public country: Country;

  @ManyToOne(() => Sector, (sector) => sector.countrysector)
  public sector: Sector;

  @Column('countryId')
  countryId: number;

  @Column('sectorId')
  sectorId: number;

  @Column({ default: null })
  uniqueIdentification: string;
}
