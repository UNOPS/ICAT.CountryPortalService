import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { LearningMaterialUserType } from './learning-material-usertype.entity';
import { LearningMaterialSector } from './learning-material-sector.entity';

@Entity({ name: 'learning_material' })
export class LearningMaterial extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  documentType: string;

  @Column({ default: null })
  documentName: string;

  @Column({ default: null })
  document: string;

  @Column({
    default:
      'https://icon-library.com/images/document-icon-image/document-icon-image-1.jpg',
  })
  thumbnail: string;

  @Column({ default: null })
  isPublish: number;

  @DeleteDateColumn({ default: null })
  deletedAt?: Date;

  @Column({ default: null })
  uniqueIdentification: string;

  @OneToMany(
    () => LearningMaterialUserType,
    (learningMaterialUserType) => learningMaterialUserType.userType,
  )
  public learningMaterialusertype!: LearningMaterialUserType[];

  @OneToMany(
    () => LearningMaterialSector,
    (learningMaterialSector) => learningMaterialSector.learningMaterial2,
  )
  public learningMaterialsector!: LearningMaterialSector[];
}
