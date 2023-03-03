import { UpdateProjectDTO } from './../common/dtos/project-dtos/update-project.dto';
import { Injectable, NotFoundException, BadGatewayException, BadRequestException } from '@nestjs/common';
import { CreateProjectDTO } from 'src/common/dtos/project-dtos/create-project.dto';
import { TransformService } from 'src/tranformer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Repository } from 'typeorm';
import { Office } from 'src/entities/office.entity';
import { User } from 'src/entities/user.entity';
import { UserDTO } from 'src/common/dtos/users-dtos/user.dto';
import { ProjectsDTO } from 'src/common/dtos/project-dtos/projects.dto';
import { OfficesService } from 'src/offices/offices.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Office) private readonly officeRepo: Repository<Office>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly transform: TransformService,
  ) {}

  async getProjects(): Promise<ProjectsDTO[]> {
    const projects = await this.projectRepo.find({
      relations: ['users', 'office'],
    });

    return projects.map(e => this.transform.toProjectsDTO(e));
  }

  public async findProjectById(id: number): Promise<ProjectsDTO> {
    const project = await this.projectRepo.findOne(id, {
      relations: ['users', 'office', 'users.project'],
    });

    if (!project) 
      throw new NotFoundException(`No project with id:${id} found`);
    
    return project;

  }

  async createProject(
    project: CreateProjectDTO,
    officeId: number,
  ): Promise<ProjectsDTO> {
    const officeEntity = await this.officeRepo.findOne(officeId, {
      relations: ['projects'],
    });

    if (!officeEntity) {
      throw new NotFoundException(`Office with id ${officeId} not found!`);
    }

    const projectEntity = await this.projectRepo.create({
      title: project.title,
      description: project.description,
      isImportant: project.isImportant,
      isFinished: false,
    });

    officeEntity.projects.push(projectEntity);

    await this.projectRepo.save(projectEntity);
    await this.officeRepo.save(officeEntity);

    return this.transform.toProjectsDTO(projectEntity, true);
  }

  async finishProject(projectId: number): Promise<ProjectsDTO> {
    const project = await this.projectRepo.findOne(projectId, {
      where: {
        isFinished: false,
      },
      relations: ['users', 'users.project'],
    });

    if (!project) {
      throw new NotFoundException(
        `No such project with id: ${projectId} found.`,
      );
    }

    project.isFinished = true;
    await this.projectRepo.save(project);

    project.users.forEach(async u => {
      u.project = null;
      await this.userRepo.save(u);
    });

    return this.transform.toProjectsDTO(project, true);
  }

  async assignUserToProject(
    userId: number,
    projectId: number,
  ): Promise<UserDTO> {
    const user = await this.userRepo.findOne(userId, {
      relations: ['project','deskSchedule', 'deskSchedule.user', 'deskSchedule.desk'],
    });

    const project = await this.projectRepo.findOne(projectId, {
      relations: ['users', 'office', 'office.desks'],
      where: {
        isFinished: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if(project.users.find(u => u.id === user.id)) {
      throw new BadGatewayException('User already assigned to project');
    }
    
    if(project.users.length + 1 > project.office.desks.filter(e => e.isFree === "Free").length) {
      throw new BadRequestException('Cannot assign more users to the project');
    }

    user.project = project;
    await this.userRepo.save(user);

    return this.transform.toUserDTO(user);
  }

  public async deleteProject(projectId: number): Promise<ProjectsDTO> {
    const deletedProject = await this.projectRepo.findOneOrFail(projectId, {
      relations: ['users', 'users.project'],
    });

    deletedProject.users.forEach(async u => {
      u.project = null;
      await this.userRepo.save(u);
    });
    return this.transform.toProjectsDTO(await this.projectRepo.remove(deletedProject));
  }

  public async updateProject(projectId: number, projectDto: UpdateProjectDTO): Promise<ProjectsDTO> {
    try
    {
      const updatedProject = await this.projectRepo.findOne(projectId)
      return this.transform.toProjectsDTO(await this.projectRepo.save({
          ...updatedProject,
          ...projectDto
      } as Project), true);
    }
    catch(e)
    {
      throw new NotFoundException(`Project with id: ${projectId} not found`)
    }
  }
}
