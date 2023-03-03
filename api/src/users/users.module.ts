import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { TransformService } from 'src/tranformer.service';
import { DeskSchedule } from 'src/entities/desk-schedule.entity';
import { Office } from 'src/entities/office.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([User, DeskSchedule, Office]),
        TransformService
    ],
    controllers: [UsersController],
    providers: [UsersService, TransformService],
    exports: [UsersService]
})
export class UsersModule {}
