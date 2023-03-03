import { UpdateProjectDTO } from './../common/dtos/project-dtos/update-project.dto';
import { Controller, Get, UseGuards, Param, NotFoundException, Delete, Put, Body, ValidationPipe, Post } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { BlacklistGuard } from "src/auth/black-list.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { UserRole } from "src/common/enums/user-roles";
import { ProjectsService } from "./projects.service";
import { Project } from "src/entities/project.entity";
import { UserDTO } from 'src/common/dtos/users-dtos/user.dto';
import { ProjectsDTO } from 'src/common/dtos/project-dtos/projects.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin, UserRole.Basic]))
  public async allProjects(): Promise<ProjectsDTO[]> {
    return await this.projectService.getProjects();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin, UserRole.Basic]))
  public async getById(@Param('id') id: number): Promise<ProjectsDTO> {
    return await this.projectService.findProjectById(id);
  }

  @Post(':id/finish')
  @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin]))
  public async finishProject(@Param('id') projectId: number): Promise<ProjectsDTO> {
    return await this.projectService.finishProject(projectId);
  }

  @Post(':projectId/users/:userId')
  @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin]))
  public async assignUser(@Param('projectId') projectId: number, @Param('userId') userId: number): Promise<UserDTO> {
    return await this.projectService.assignUserToProject(+userId, +projectId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin]))
  public async updateProject(@Param('id') projectId: number, @Body(new ValidationPipe({ whitelist: true })) project: UpdateProjectDTO): Promise<ProjectsDTO> {
    return await this.projectService.updateProject(projectId, project);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin]))
  public async deleteProject(@Param('id') projectId: number): Promise<ProjectsDTO> {
    return await this.projectService.deleteProject(projectId);
  }
}
