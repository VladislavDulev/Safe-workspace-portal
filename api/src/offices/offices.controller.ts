import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { CreateOfficeDTO } from 'src/common/dtos/office-dtos/create-office.dto';
import { CreateProjectDTO } from 'src/common/dtos/project-dtos/create-project.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BlacklistGuard } from 'src/auth/black-list.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/common/enums/user-roles';
import { OfficeDTO } from 'src/common/dtos/office-dtos/office.dto';
import { ProjectsDTO } from 'src/common/dtos/project-dtos/projects.dto';

@Controller('offices')
export class OfficesController {
    constructor(
        private readonly officeService: OfficesService,
        private readonly projectService: ProjectsService,
    ) {}
    @Get()
    async getOffices(): Promise<OfficeDTO[]> {
        return await this.officeService.getOffices();
    }

    @Get('/countries')
    async getOfficesCountries() {
        return await this.officeService.getCountries();
    }

    @Get(':id')
    async getOffice(@Param('id') officeId: number): Promise<OfficeDTO> {
        return await this.officeService.getOffice(officeId);
    }

    @Post()
    @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin]))
    async createOffice(@Body() office: CreateOfficeDTO): Promise<OfficeDTO> {
        return await this.officeService.createAnOffice(office);
    }

    @Post(':officeId/schedule')
    @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin]))
    async schedule(@Param('officeId') officeId: number): Promise<OfficeDTO> {
        return await this.officeService.rotateOfficeById(+officeId);
    }

    @Post(':officeId/projects/')
    @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin]))
    async createOfficeProject(@Param('officeId') officeId: number, @Body() project: CreateProjectDTO): Promise<ProjectsDTO> {
        return await this.projectService.createProject(project, +officeId)
    }
}