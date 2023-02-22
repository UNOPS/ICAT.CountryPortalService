import { Methodology } from 'src/methodology/entity/methodology.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('mitigationActionType')
export class MitigationActionType extends MasterData {
  // @PrimaryGeneratedColumn()
  // id: number;
  // @Column()
  // name: string;

  @OneToMany(
    () => Methodology,
    (methodology) => methodology.mitigationActionType,
  )
  methodology: Methodology[];

  @Column({ default: null })
  uniqueIdentification: string;
}
