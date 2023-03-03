import { OfficeDTO } from "../office-dtos/office.dto";
import { ResponseUserDTO } from "../users-dtos/response-user.dto";

export class ProjectsDTO {
  id: number;

  title: string;

  description: string;

  users?: ResponseUserDTO[];

  office?: OfficeDTO;

  isFinished: boolean; 

  isImportant: boolean;
}