import { Sector } from 'src/master-data/sector/sector.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sub-sector' })
export class SubSector extends BaseTrackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ length: 300, default: null })
  description: string;

  @Column({ default: 1 })
  sortOrder: number;

  @ManyToOne(() => Sector, (sector) => sector.subSector)
  public sector!: Sector;
}
