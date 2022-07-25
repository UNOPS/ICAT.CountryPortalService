import { type } from 'os';
import { Country } from 'src/country/entity/country.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InstitutionCategory } from './institution.category.entity';
import { InstitutionType } from './institution.type.entity';

@Entity()
export class Institution extends BaseTrackingEntity {
  /**
   *
   */
  constructor() {
    super();
    this.status = 0;
    this.sortOrder = 0;
    this.isNational = false;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ length: 300, nullable: true  })
  description: string;

  @Column()
  sortOrder: number;

  @ManyToOne((type) => InstitutionCategory,  { cascade: false, nullable: true })
  @JoinColumn()
  category: InstitutionCategory;

  @ManyToOne((type) => InstitutionType, { cascade: false, nullable: true })
  @JoinColumn()
  type: InstitutionType;

  @Column({ default: null })
  isNational: boolean;

  @ManyToOne((type) => Institution, { cascade: false, nullable: true })
  @JoinColumn()
  parentInstitution?: Institution;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ default: 0 })
  canNotDelete?: boolean;

  @Column({ length: 100 ,nullable: true })
  address: string;

  @Column({ name: 'sectorId' })
  sectorId: number;

  @ManyToOne((type) => Sector, { cascade: false, nullable: true ,eager:true})
  @JoinColumn()
  sector?: Sector;

  @ManyToOne((type) => Country, { cascade: false, nullable: true ,eager:true})
  @JoinColumn()
  country: Country;

  @Column()
  telephoneNumber: string;

  @Column({ length: 30, default: null, nullable: true })
  email: string;

  @Column({ default: null })
  uniqueIdentification: string;
}
