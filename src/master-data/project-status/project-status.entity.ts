import { MasterData } from 'src/shared/entities/master.data.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'projectstatus' })
export class ProjectStatus extends MasterData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
