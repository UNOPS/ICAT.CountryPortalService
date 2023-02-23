import { Institution } from 'src/institution/institution.entity';
import { InstitutionType } from 'src/institution/institution.type.entity';
import { LearningMaterialUserType } from 'src/learning-material/entity/learning-material-usertype.entity';
import { LearningMaterial } from 'src/learning-material/entity/learning-material.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class UserType extends MasterData {
  @OneToMany(
    () => LearningMaterialUserType,
    (learningMaterialUserType) => learningMaterialUserType.userType,
  )
  public learningMaterialusertype!: LearningMaterialUserType[];

  @ManyToMany((type) => InstitutionType, { cascade: false })
  @JoinTable({ name: 'instype_usertype' })
  institutionType: InstitutionType;
}
