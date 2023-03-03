import { CountryEnum } from "src/common/enums/coutries.enum";
import { DeskDTO } from "../desk-dtos/desk.dto";
import { ProjectsDTO } from "../project-dtos/projects.dto";

export class OfficeDTO {
    id: number;

    name: string;

    deskPerCol: number;

    deskPerRow: number;

    rows: number;

    columns: number;

    distanceBetweenRows: number;

    distanceBetweenCols: number;
    
    country: CountryEnum;

    desks?: DeskDTO[];

    projects?: ProjectsDTO[];
}