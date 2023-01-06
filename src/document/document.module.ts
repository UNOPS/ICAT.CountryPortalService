import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Documents } from './entity/document.entity';
import { User } from 'src/users/user.entity';
import { Audit } from 'src/audit/entity/audit.entity';
import { AuditService } from 'src/audit/audit.service';
import { TokenDetails } from 'src/utills/token_details';
import { Project } from 'src/project/entity/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Documents,User,Audit,Project])],
  providers: [DocumentService,AuditService,TokenDetails],
  controllers: [DocumentController],
  exports: [DocumentService,AuditService],
})
export class DocumentModule {}
