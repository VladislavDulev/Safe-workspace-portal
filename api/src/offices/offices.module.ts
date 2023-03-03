import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from 'src/entities/office.entity';
import { Desk } from 'src/entities/desk.entity';
import { User } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';
import { ProjectsService } from 'src/projects/projects.service';
import { TransformService } from 'src/tranformer.service';
import { DeskSchedule } from 'src/entities/desk-schedule.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CovidDataService } from 'src/covid-data/covid-data.service';
import { CovidDataModule } from 'src/covid-data/covid-data.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Desk, User, Project, DeskSchedule, Project, Office]),
    CovidDataModule
  ],
  controllers: [OfficesController],
  providers: [OfficesService, ProjectsService, TransformService]
})
export class OfficesModule {}
