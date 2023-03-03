import { Injectable, NotFoundException, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Office } from 'src/entities/office.entity';
import { Repository } from 'typeorm';
import { Desk } from 'src/entities/desk.entity';
import { CreateOfficeDTO } from 'src/common/dtos/office-dtos/create-office.dto';
import { DeskSchedule } from 'src/entities/desk-schedule.entity';
import { Project } from 'src/entities/project.entity';
import { Cron } from '@nestjs/schedule';
import { CRON } from 'src/common/enums/cron-job.enum';
import { off } from 'process';
import { CountryEnum } from 'src/common/enums/coutries.enum';
import { CovidDataService } from 'src/covid-data/covid-data.service';
import { Constants } from '../common/constants';
import { TransformService } from 'src/tranformer.service';
import { OfficeDTO } from 'src/common/dtos/office-dtos/office.dto';
@Injectable()
export class OfficesService {
    constructor(
        @InjectRepository(Office) private readonly officeRepo: Repository<Office>,
        @InjectRepository(Desk) private readonly deskRepo: Repository<Desk>,
        @InjectRepository(DeskSchedule) private readonly scheduleRepo: Repository<DeskSchedule>,
        @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
        private readonly covidService: CovidDataService,
        private readonly transform: TransformService,
    ) {}

    async getOffices(): Promise<OfficeDTO[]> {
        const offices = await this.officeRepo.find({
            relations: ['projects', 'projects.users', 'desks', 'desks.schedule', 'desks.schedule.user']
        });

        return offices.map(o => this.transform.toOfficeDTO(o, true));
    }

    async getOffice(officeId: number): Promise<OfficeDTO> {
        try 
        {
            const office = await this.officeRepo.findOneOrFail(officeId, {
                relations: ['projects', 'projects.users', 'desks', 'desks.schedule', 'desks.schedule.user', 'desks.schedule.desk', 'desks.schedule.office']
            });
    
            return this.transform.toOfficeDTO(office);
        }
        catch(e)
        {
            throw new NotFoundException(e.message);
        }
    }

    async createAnOffice(office: CreateOfficeDTO): Promise<OfficeDTO> {
        const officeEntity = await this.officeRepo.findOne({
            where: {
                country: office.country
            }
        })

        if(officeEntity){
            throw new BadGatewayException('Office in this country already exists');
        }

        return this.transform.toOfficeDTO(await this.createOffice(office), true);      
    }

    //Rotation by automation
    @Cron(CRON.EVERY_SUNDAY)
    async rotateUsersFromOfficeNextWeek(): Promise<OfficeDTO[]> {
        try
        {
            const offices = await this.officeRepo.find({
                relations: ['projects', 'projects.users', 'desks', 'desks.schedule', 'desks.schedule.user']
            })

            offices.forEach(async e => await this.rotateOffice(e));

            return offices.map(e => this.transform.toOfficeDTO(e, true));
        }
        catch(e)
        {
            throw new NotFoundException(e.message + ' office not found')
        }
    }

    //Rotate manually
    async rotateOfficeById(officeId: number): Promise<OfficeDTO>{
        try
        {
            const officeEntity = await this.officeRepo.findOne(+officeId, {
                relations: ['projects', 'projects.users', 'desks', 'desks.schedule', 'desks.schedule.user', 'desks.schedule.desk', 'desks.schedule.office']
            })
            if(!officeEntity) throw new NotFoundException('Office not found');
            return await this.rotateOffice(officeEntity);
        }
        catch(e)
        {
            throw e;
        }
    }
    
    async getOfficeDesks(officeId: number): Promise<Desk[]> {
        try
        {
            const officeEntity = await this.officeRepo.findOneOrFail(officeId, {
                relations: ['desks', 'desks.schedule', 'desks.schedule.user', 'desks.schedule.desk']
            })

            return officeEntity.desks;
        }
        catch(e)
        {
            throw new NotFoundException(e.message);
        }
    }

    async getCountries(){
        const offices = await this.officeRepo.find();

        return offices.map(e => e.country);
    }

    private async createOffice(office: CreateOfficeDTO): Promise<Office> {
        const existingOffice = await this.officeRepo.findOne({
            where: {
                country: office.country
            }
        }) 
        if(existingOffice) {
            throw new BadGatewayException('Office already exists in this country');
        }
        const officeEntity = await this.officeRepo.create({
            name: office.name,
            deskPerCol: office.deskPerCol,
            deskPerRow: office.deskPerRow,
            country: office.country,
            rows: office.rows,
            columns: office.columns,
            distanceBetweenRows: office.distanceBetweenRows,
            distanceBetweenCols: office.distanceBetweenCols,
        });
        await this.officeRepo.save(officeEntity);
    
        const rowsAndColsNotEqualCapacity = office.deskPerCol !== 1 && office.deskPerRow !== 1;
        for(let i = 0; i < office.rows * office.deskPerRow; ++i){
            for(let k = 0; k < office.columns * office.deskPerCol; ++k) {
                let isFree;
                if(i % 2 === 0) {
                    isFree = rowsAndColsNotEqualCapacity ? ( (k + 1) % 2 === 0 ? "Free" : "Not available") : "Free";
                } else {
                    isFree = rowsAndColsNotEqualCapacity ? ( (k + 1) % 2 !== 0 ? "Free" : "Not available") : "Free";
                }
                const officeDesk = await this.deskRepo.create({
                    office: officeEntity,
                    isFree
                })
    
                await this.deskRepo.save(officeDesk);
            }
        }
        

        return officeEntity;
    }

    private async rotateOffice(office: Office): Promise<OfficeDTO>{
        const unfinishedProjects = office.projects.filter(p => !p.isFinished);
        
        if(unfinishedProjects.length === 0) {
            throw new NotFoundException('Office has active projects');
        }
        const randomProject = Math.round((unfinishedProjects.length - 1) * Math.random());
        const currentProject = unfinishedProjects[randomProject];
        
        const workingUsers = currentProject.users.filter(u => {
            if(!u.vacationStart && !u.vacationEnd) {
                return true;
            }
            
            return new Date(u.vacationStart) >= new Date() && new Date(u.vacationEnd) <= new Date()
        });

        const maxWorkingUsersInOffice = workingUsers.length * await this.getNumberOfAvailablePeople(office.country);
        
        let workingUsersIndex = 0;
        
        let schedules: DeskSchedule[] = await this.scheduleRepo.find({
            relations: ['office', 'desk', 'user'],
            where: { office }
        });
        
        schedules.map(async (e: DeskSchedule) => {
            if(new Date(e.dateStart) >= new Date) {
                await this.scheduleRepo.remove(e);
            } 
        });

        const freeDesks = office.desks.filter(e => e.isFree === "Free");
        for (const desk of freeDesks) {
            if(workingUsersIndex >= maxWorkingUsersInOffice) {
                break;
            }

            const schedule = await this.createSchedule(office, desk);
            
            schedule.user = workingUsers[workingUsersIndex++];
            
            await this.scheduleRepo.save(schedule);    
        }

        await this.officeRepo.save(office);

        return this.transform.toOfficeDTO(office, true);
    }

    private async createSchedule(office: Office, desk: Desk): Promise<DeskSchedule> {
        const nextWeekNow = new Date();
        nextWeekNow.setDate(nextWeekNow.getDate() + 7);
        
        let schedule = await this.scheduleRepo.create({
            office, desk,
        })
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        schedule.dateStart = this.nextDay(now, 0);
        schedule.dateEnd = new Date(schedule.dateStart);
        schedule.dateEnd.setDate(schedule.dateEnd.getDate() + 5);

        return schedule; 

    }

    private nextDay(d: Date, dow: number){
        //dow - day of week - [0, 6]
        const newDate = new Date(d);
        newDate.setDate(d.getDate() + (dow+(7-d.getDay())) % 7);
        return newDate;
    }

    private firstDateBiggerThenSecond(d1: Date, d2: Date): boolean {
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);

        return d1 >= d2;
    }

    async getNumberOfAvailablePeople(country: CountryEnum): Promise<number> {
        const ratio = await this.covidService.getCountryRatio(Object.keys(CountryEnum).find(e => CountryEnum[e] === country));
        if(ratio > 10) {
            return 0.5;
        }
        
        if(ratio > 5) {
            return 0.75;
        }

        return 1;
    }
}