import { CountryEnum } from "src/common/enums/coutries.enum";
import { OfficeDTO } from "../office-dtos/office.dto";
import { ProjectsDTO } from "../project-dtos/projects.dto";
import { DeskScheduleDTO } from "../schedule-dtos/desh-schedule.dto";

export class UserDTO {
    id: number;
  
    username: string;
  
    email: string;
  
    fullname: string;

    country: CountryEnum;
  
    isInVacation: boolean;
  
    vacationStart: Date;
    
    vacationEnd: Date;
  
    isBanned: boolean;
      
    project?: ProjectsDTO;
  
    deskSchedule?: DeskScheduleDTO[];
}