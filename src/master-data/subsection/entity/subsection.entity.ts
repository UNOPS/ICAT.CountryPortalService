import { Methodology } from 'src/methodology/entity/methodology.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('methodology_subsection')
export class SubsectionEntity extends MasterData {
  @Column()
  type: string; // baseline or project

  @Column()
  parentType: string;

  @ManyToOne((type) => Methodology, { cascade: false })
  @JoinColumn({ name: 'methodologyId' })
  methodology?: Methodology;
}
