import { Assessment } from 'src/assesment/entity/assesment.entity';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity('applicability')
export class ApplicabilityEntity extends MasterData {
  //   @ManyToMany((type) => Methodology, { cascade: false })
  //   @JoinTable({ name: 'methodology_applicability' })
  //   methodology: Methodology;
  @Column({ default: null })
  uniqueIdentification: string;

  @ManyToOne((type) => Assessment, {
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn()
  assessment?: Assessment;


  @OneToMany(() => Methodology, methodology => methodology.applicability)
  methodologies: Methodology[];

}
