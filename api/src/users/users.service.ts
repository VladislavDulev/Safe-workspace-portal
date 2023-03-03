import { Injectable, BadGatewayException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TransformService } from 'src/tranformer.service';
import { CreateUserDTO } from 'src/common/dtos/users-dtos/create-user.dto';
import { ResponseUserDTO } from 'src/common/dtos/users-dtos/response-user.dto';
import { Limits } from 'src/common/enums/limits';
import { User } from 'src/entities/user.entity';
import { CountryEnum } from 'src/common/enums/coutries.enum';
import { DeskSchedule } from 'src/entities/desk-schedule.entity';
import { Office } from 'src/entities/office.entity';
import { VacationDTO } from 'src/common/dtos/users-dtos/vacation.dto';
import { UserDTO } from 'src/common/dtos/users-dtos/user.dto';
@Injectable()
export class UsersService {
    constructor(
        private readonly transformer: TransformService,
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(Office) private readonly officeRepo: Repository<Office>,
        @InjectRepository(DeskSchedule) private readonly scheduleRepo: Repository<DeskSchedule>,
        
    ) {}

    async create(userDto: CreateUserDTO): Promise<ResponseUserDTO> {
      if(userDto.password !== userDto.repeatpassword) {
          throw new BadGatewayException('Passwords do not match');
      }

      if(!(await this.officeRepo.findOne({where:{country: userDto.country}}))){
        throw new NotFoundException('There is no office in that country');
      }

      const user = this.usersRepository.create({
        username: userDto.username,
        password: await bcrypt.hash(userDto.password, Limits.HASH_ROUNDS),
        email: userDto.email,
        country: userDto.country,
        fullname: userDto.fullname
      });

      try
      {
        const created = await this.usersRepository.save(user);

        return this.transformer.toResponseUserDTO(created);
      }
      catch(e)
      {
        throw new BadGatewayException(e.message);
      }
  
    }

    async vacation(userId: number, req, vacation: VacationDTO) {
      if(req.user.sub !== userId) {
        throw new BadGatewayException('You cannot assing vacations if you are not the user');        
      }
      const userEntity = await this.usersRepository.findOne(+req.user.sub);

      if(!userEntity) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      const start = new Date(vacation.start);
      start.setHours(0, 0, 0, 0);
      const end = new Date(vacation.end);
      end.setHours(0, 0, 0, 0);
      if(end <= start) {
        throw new BadGatewayException('Invalid dates, vacation should be at least a day');        
      }
      
      userEntity.vacationStart = start;
      userEntity.vacationEnd = end;
      
      await this.usersRepository.save(userEntity);

      return this.transformer.toUserDTO(userEntity, true);
    }

    async vacationRemove(userId: number, req) {
      if(req.user.sub !== userId) {
        throw new BadGatewayException('You cannot assing vacations if you are not the user');        
      }

      const userEntity = await this.usersRepository.findOne(+req.user.sub);

      if(!userEntity) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      
      userEntity.vacationStart = null;
      userEntity.vacationEnd = null;
      
      await this.usersRepository.save(userEntity);

      return this.transformer.toUserDTO(userEntity, true);
    }

    public async deleteUser(userId: number): Promise<ResponseUserDTO> {
      try
      {
        const user = await this.usersRepository.findOneOrFail(+userId, {
          relations: ['deskSchedule', 'deskSchedule.user']
        });
        user.deskSchedule.forEach(async e => {
          await this.scheduleRepo.remove(e);  
        })
        return this.transformer.toResponseUserDTO(await this.usersRepository.remove(user));
      }
      catch(e)
      {
        console.log(e);
        throw new NotFoundException(e.message);
      }
    }

    async banUser(userId: number): Promise<ResponseUserDTO> {
      const user = await this.usersRepository.findOne(userId);
      
      if(!user) {
        throw new NotFoundException(`user not found with ${userId}`);
      }

      user.isBanned = !user.isBanned;
  
      return this.transformer.toResponseUserDTO(await this.usersRepository.save(user));
    }

    async getAllFromCurrenSchedule(): Promise<DeskSchedule[]> {
      const deskSchedules = await this.scheduleRepo.find({
        relations: ['user', 'office', 'desk']
      });

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return deskSchedules.filter(s => s.dateEnd >= now);
    }
      
    async getAllSchedules(){
      const deskSchedules = await this.scheduleRepo.find({
        relations: ['user', 'office', 'desk']
      });
      
      return deskSchedules;
    }

    async getAllUsers(): Promise<UserDTO[]> {
      const users = await this.usersRepository.find({
        where: {
          isBanned: false
        },
        relations: ['deskSchedule','deskSchedule.user', 'deskSchedule.office', 'deskSchedule.desk', 'project']
      })
      return users.map(e => this.transformer.toUserDTO(e));
    }

    async getAllUsersFromCountry(cCode: CountryEnum): Promise<UserDTO[]> {
      const users = await this.usersRepository.find({
        where: {
          isBanned: false,
          country: cCode
        },
        relations: ['deskSchedule','deskSchedule.user', 'deskSchedule.office', 'deskSchedule.desk', 'project']
      })
      return users.map(e => this.transformer.toUserDTO(e));
    }

    async getUser(userId: number): Promise<UserDTO> {
      const user = await this.usersRepository.findOne(+userId, {
        where: {
          isBanned: false
        },
        relations: ['deskSchedule','deskSchedule.user', 'deskSchedule.office', 'deskSchedule.desk', 'project']
      });
      if(!user) {
        throw new NotFoundException(`User with id${userId} not found`)
      }
      return this.transformer.toUserDTO(user)
    }
}
