import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { TransformService } from "src/tranformer.service";
import { Project } from "src/entities/project.entity";
import { User } from "src/entities/user.entity";
import { Office } from "src/entities/office.entity";
import { OfficesModule } from "src/offices/offices.module";
import { OfficesService } from "src/offices/offices.service";
import { Desk } from "src/entities/desk.entity";

@Module({
    imports: [
      TypeOrmModule.forFeature([Project, User, Office]),
      OfficesModule
    ],
    controllers: [ProjectsController],
    providers: [ProjectsService, TransformService],
  })
export class ProjectsModule {}