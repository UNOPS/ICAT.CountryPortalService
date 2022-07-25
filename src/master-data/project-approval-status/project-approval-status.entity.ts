import { MasterData } from 'src/shared/entities/master.data.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectApprovalStatus extends MasterData {}

/*
project_approval_status
======================
name :-

1 Accept
2 Reject
3 Data Request
4 Propose
5 Active

*/