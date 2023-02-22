import { Sector } from 'src/master-data/sector/sector.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LearningMaterial } from './learning-material.entity';

@Entity({ name: 'learning_material_sector' })
export class LearningMaterialSector extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  uniqueIdentification: string;

  @ManyToOne(
    () => LearningMaterial,
    (learningMaterial) => learningMaterial.learningMaterialsector,
  )
  public learningMaterial2!: LearningMaterial;

  @ManyToOne(() => Sector, (sector) => sector.learningMaterialsector)
  public sector!: Sector;

  /*
    @ManyToMany((type) => UserType, {
      eager: true,
      cascade: false,
    })


    @ManyToMany(() => UserType, userType => userType.learningmaterils)
    @JoinTable()
    userTypes?: UserType[];

    @ManyToMany(() => Sector, sector => sector.learningmaterils)
    @JoinTable()
    sectors?: Sector[];

*/
}
