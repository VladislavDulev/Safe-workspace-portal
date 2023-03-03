import { Module, HttpModule } from '@nestjs/common';
import { CovidDataService } from './covid-data.service';
import { CovidDataController } from './covid-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CovidData } from 'src/entities/covid-data.entity';

@Module({
    imports:[
      ScheduleModule.forRoot(),
      TypeOrmModule.forFeature([CovidData]),
      HttpModule
    ],
    providers: [CovidDataService],
    controllers: [CovidDataController],
    exports: [CovidDataService]
})
export class CovidDataModule {}
