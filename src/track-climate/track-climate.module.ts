import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Project } from 'src/project/entity/project.entity';
import { ProjectService } from 'src/project/project.service';
import { TokenDetails } from 'src/utills/token_details';
import { TrackcaEntity } from './entity/trackca.entity';
import { TrackClimateController } from './track-climate.controller';
import { TrackClimateService } from './track-climate.service';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { AssesmentModule } from 'src/assesment/assesment.module';

@Module({
  imports: [TypeOrmModule.forFeature([TrackcaEntity,Project,Assessment]), AssesmentModule],
  controllers: [TrackClimateController],
  providers: [TrackClimateService,TokenDetails,ProjectService,EmailNotificationService],
  exports: [TrackClimateService],
})
export class TrackClimateModule {}
