import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcript from 'bcrypt';
import { UserType } from './user.type.entity';
import { Exclude } from 'class-transformer';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Institution } from 'src/institution/institution.entity';
import { Audit } from 'src/audit/entity/audit.entity';
import { Country } from 'src/country/entity/country.entity';
import { Assessment } from 'src/assesment/entity/assesment.entity';

@Entity()
export class User extends BaseTrackingEntity {
  constructor() {
    super();
    this.salt = 'n/a';
    this.status = 0;
    this.password = '';
    this.resetToken = '';
    //  this.abc = this.firstName + this.lastName;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userTypeId' })
  userTypeId: number;

  @ManyToOne((type) => UserType, { eager: true })
  @JoinColumn()
  userType: UserType;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne((type) => Institution, { eager: true })
  @JoinColumn()
  institution: Institution;

  @OneToMany(() => Assessment, assessment => assessment.user)
    assessments: Assessment[];

  @Column()
  telephone: string;

  @Column()
  mobile: string;

  @Column({ nullable: true })
  designation: string;


  // @Column({ name: 'countryId' })
  // countryId: number;

  @ManyToOne((type) => Country, {eager: true})
  @JoinColumn()
  country: Country;

  @Exclude()
  @Column()
  salt: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  resetToken: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ default: 0 })
  canNotDelete?: boolean;

  @Column({ default: null })
    uniqueIdentification: string;

  fullName: string;

  updateFullName() {
    this.fullName = this.firstName + (this.lastName ? ' ' + this.lastName : '');
  }

  // abc: string = ()=>{  this.firstName + this.lastName};

  get fullname2() {
    return this.firstName;
  }

  private _fullname: string;
  get fullname(): string {
    this._fullname =
      this.firstName + (this.lastName ? ' ' + this.lastName : '');
    return this._fullname;
  }

  set fullname(value: string) {}

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcript.hash(password, this.salt);
    return hashPassword === this.password;
    // return true;
  }

  async validateResetToken(token: string): Promise<boolean> {
    return token === this.resetToken;
  }
}
