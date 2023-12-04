import { MasterData } from 'src/shared/entities/master.data.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FinancingScheme extends MasterData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
