import { User } from "./entities/user.entity";
import { ResponseUserDTO } from "./common/dtos/users-dtos/response-user.dto";
import { UserDTO } from "./common/dtos/users-dtos/user.dto";
import { ProjectsDTO } from "./common/dtos/project-dtos/projects.dto";
import { Project } from "./entities/project.entity";
import { Office } from "./entities/office.entity";
import { OfficeDTO } from "./common/dtos/office-dtos/office.dto";
import { Desk } from "./entities/desk.entity";
import { DeskDTO } from "./common/dtos/desk-dtos/desk.dto";
import { DeskSchedule } from "./entities/desk-schedule.entity";
import { DeskScheduleDTO } from "./common/dtos/schedule-dtos/desh-schedule.dto";

export class TransformService {
  toResponseUserDTO(user: User): ResponseUserDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullname: user.fullname
    }
  }
  toUserDTO(user: User, end: boolean = false): UserDTO {
    if(!user) return null;
    const now = new Date();
    // this gets the date from UTC and completely ignores local time zones so i added 3 hours because of the difference
    now.setHours(now.getHours() + 3);
    let retVal: UserDTO = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      country: user.country,
      isInVacation: user.vacationStart <= now && now <= user.vacationEnd,
      vacationStart: user.vacationStart,
      vacationEnd: user.vacationEnd,
      isBanned: user.isBanned,
    };

    if(end) {
      return retVal; 
    }

    retVal = {
      ...retVal,
      project: this.toProjectsDTO(user.project, true),
      deskSchedule: user.deskSchedule.map(e => this.toDeskScheduleDTO(e, true)),
    };

    return retVal;
  }

  toProjectsDTO(project: Project, end: boolean = false): ProjectsDTO {
    if(!project) return null;
    let retVal: ProjectsDTO =  {
      id: project.id,
      title: project.title,
      description: project.description,
      isFinished: project.isFinished,
      isImportant: project.isImportant,
    }
    if(end) {
      return retVal;
    }
    retVal = {
      ...retVal,
      users: project.users.map(u => this.toResponseUserDTO(u)),
      office: this.toOfficeDTO(project.office, true)
    }
    return retVal;
  }

  toOfficeDTO(office: Office, end: boolean = false): OfficeDTO {
    if(!office) return null;
    let retVal: OfficeDTO = {
      id: office.id,
      name: office.name,
      deskPerCol: office.deskPerCol,
      deskPerRow: office.deskPerRow,
      rows: office.rows,
      columns: office.columns,
      distanceBetweenRows: office.distanceBetweenRows,
      distanceBetweenCols: office.distanceBetweenCols,
      country: office.country,
    }
    if(end) {
      return retVal;
    }

    retVal= {
      ...retVal,
      desks: office.desks.map(e => this.toDeskDTO(e)),
      projects: office.projects.map(e => this.toProjectsDTO(e, true))
    }
    return retVal;
  }

  toDeskDTO(desk: Desk, end = false): DeskDTO {
    if(!desk) return null;
    let retVal: DeskDTO = {
      id: desk.id,
      isFree: desk.isFree
    }
    if(end){
      return retVal;
    }
    
    retVal = {
      ...retVal,
      office: this.toOfficeDTO(desk.office, true),
      pendingSchedules: desk.schedule.filter(e => e.dateEnd >= new Date()).map(e => this.toDeskScheduleDTO(e, true))
    }

    return retVal;
  }

  toDeskScheduleDTO(schedule: DeskSchedule, end = false): DeskScheduleDTO {
    if(!schedule) return null;
    let retVal: DeskScheduleDTO = {
      user: this.toResponseUserDTO(schedule.user),
      desk: this.toDeskDTO(schedule.desk, true),
      dateStart: schedule.dateStart,
      dateEnd: schedule.dateEnd,
    }
    if(end) {
      return retVal;
    }

    retVal = {
      ...retVal,
      office: this.toOfficeDTO(schedule.office, true)
    }
    return retVal;
  }
}
