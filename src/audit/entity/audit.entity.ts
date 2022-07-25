import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'audit' })
export class Audit extends BaseTrackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { eager: true })
  @JoinColumn()
  user: User;

  @Column({ default: null })
  userName: string;

  @Column()
  action: string;

  @Column()
  comment: string;

  @Column()
  actionStatus: string;

  @Column()
  userType: string;
}
