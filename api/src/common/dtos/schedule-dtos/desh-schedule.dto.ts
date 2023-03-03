import { ResponseUserDTO } from "../users-dtos/response-user.dto";
import { OfficeDTO } from "../office-dtos/office.dto";
import { DeskDTO } from "../desk-dtos/desk.dto";

export class DeskScheduleDTO {
    user: ResponseUserDTO;
    office?: OfficeDTO;
    desk: DeskDTO;

    dateStart: Date;
    dateEnd: Date;
}