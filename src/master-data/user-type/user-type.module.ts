import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UserType } from 'src/users/user.type.entity';
import { UserTypeController } from './user.type.controller';
import { UserTypeService } from './user.type.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserType, User])],
  controllers: [UserTypeController],
  providers: [UserTypeService],
  exports: [UserTypeService],
})
export class UserTypeModule {}
