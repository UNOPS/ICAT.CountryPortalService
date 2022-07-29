import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MethodologyDataController } from "./methodology-data.controller";
import { MethodologyData } from "./methodology-data.entity";
import { MethodologyDataService } from "./methodology-data.service";

@Module({
    imports: [TypeOrmModule.forFeature([MethodologyData])],
    controllers: [MethodologyDataController],
    providers: [MethodologyDataService],
    exports: [MethodologyDataService],
  })
  export class MethodologyDataModule {}