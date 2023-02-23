import { MasterData } from 'src/shared/entities/master.data.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectApprovalStatus extends MasterData {}
