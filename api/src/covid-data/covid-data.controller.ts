import { Controller, Get, Put, Param } from '@nestjs/common';
import { CovidDataService } from './covid-data.service';
import { CovidDataDTO } from 'src/common/dtos/covid-data-dtos/covid-data.dto';

@Controller('covid/data')
export class CovidDataController {
    constructor(
        private readonly covidService: CovidDataService
    ) {}

    @Put()
    async updateCovidDataBase(): Promise<{message: string}> {
        return await this.covidService.saveCurrentDayCovidData();
    }

    @Get()
    async getAllCovidData(): Promise<CovidDataDTO[]> {
        return await this.covidService.getAllCountryCovidData();
    }

    @Get('/:country')
    async getCountryCovidData(@Param('country') country: string): Promise<CovidDataDTO[]> {
        return await this.covidService.getCountryCovidData(country);
    }

    @Get('/:country/ratio')
    async getCountryCovidRatio(@Param('country') country: string): Promise<number> {
        return await this.covidService.getCountryRatio(country);
    }
}
