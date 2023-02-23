import { Methodology } from 'src/methodology/entity/methodology.entity';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Ndc } from './ndc.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';

@Entity()
export class SubNdc extends MasterData {
  @ManyToOne((type) => Ndc)
  @JoinColumn()
  ndc: Ndc;

  @ManyToMany((type) => Methodology, { cascade: false })
  @JoinTable({ name: 'methodology_subndc' })
  methodology: Methodology;
  @OneToMany(() => Assessment, (assessment) => assessment.subNdc)
  assessments: Assessment[];
}
