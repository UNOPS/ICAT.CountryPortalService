import { Country } from 'src/country/entity/country.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentOwner } from './document-owner.entity';

@Entity()
export class Documents extends BaseTrackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  documentOwner: DocumentOwner;

  @Column()
  documentOwnerId: number;

  @Column()
  mimeType: string;

  @Column()
  fileName: string;

  @Column()
  relativePath: string;

  @ManyToOne((type) => Country, {eager: true})
  @JoinColumn()
  country: Country;

  url: string;
  viewUrl: string;

  
}
