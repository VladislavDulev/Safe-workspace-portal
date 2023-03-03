import { Injectable, HttpService, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CovidData } from 'src/entities/covid-data.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Limits } from 'src/common/enums/limits';
import { CovidDataDTO } from 'src/common/dtos/covid-data-dtos/covid-data.dto';
import { CRON } from 'src/common/enums/cron-job.enum';

@Injectable()
export class CovidDataService {
    constructor(
        @InjectRepository(CovidData) private readonly covidRepo: Repository<CovidData>,
        private readonly httpsService: HttpService
    ) {}

    @Cron(CRON.EVERY_DAY)
    async saveCurrentDayCovidData(): Promise<{message: string}> {
        const message = {message: 'DB updated successfully with new covid data'}
        let covidData = (await this.httpsService.get(Limits.COVID_URL + 'countries').toPromise()).data;

        covidData = covidData.map(element => {
                element.date = new Date();
                element.date.setHours(0, 0, 0, 0);
                return element;
            });

        await this.covidRepo.save(covidData);
        console.log(message);
        return message;
    }

    async getAllCountryCovidData(): Promise<CovidDataDTO[]> {
        return await this.covidRepo.find();
    }

    async getCountryCovidData(country: string): Promise<CovidDataDTO[]> {
        try
        {
            const covidData = await this.covidRepo.find({
                where: {
                    country
                }
            })

            return covidData;
        }
        catch(e)
        {
            throw new NotFoundException(e.message);
        }
    }

    async getCountryRatio(country: string): Promise<number> {
        let countryCovidData = await this.getCountryCovidData(country);
        const now = new Date();
        now.setDate(now.getDate() - 7);
        now.setHours(0, 0, 0, 0);
        countryCovidData = countryCovidData.filter(e => new Date(e.date) >= now);
        const todayCasesAverage = countryCovidData.reduce((acc, currVal) => acc + currVal.todayCases, 0) / countryCovidData.length;
        const casesPerOneMillionAverage = countryCovidData.reduce((acc, currVal) => acc + currVal.casesPerOneMillion, 0) / countryCovidData.length;
        return todayCasesAverage / casesPerOneMillionAverage;
    }
}
