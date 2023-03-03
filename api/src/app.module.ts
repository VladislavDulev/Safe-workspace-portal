import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficesModule } from './offices/offices.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { TransformService } from './tranformer.service';

import { CovidDataModule } from './covid-data/covid-data.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthService } from './auth/auth.service';
import { BlacklistGuard } from './auth/black-list.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'workplacedb',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), 
  UsersModule, OfficesModule, ProjectsModule, AuthModule, CovidDataModule],
  controllers: [AppController],
  providers: [AppService, TransformService],
  exports: [TransformService]
})
export class AppModule {}
//TO-DOS
/*
  Back-End:
  CovidData - [V]
  Assing Projects - [V],
  Update Projects,
  Delete Projects,
  Do Projects - [V],
  Rotation of users - [V] - kinda,
  Request free desk as a user,
  Transform Service
  Simplify stuff
  
  Front-End:
  Ag-grid
  Design sreshta
*/