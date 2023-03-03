import { OfficeDTO } from "../office-dtos/office.dto";
import { DeskScheduleDTO } from "../schedule-dtos/desh-schedule.dto";

export class DeskDTO {
    id: number;
    isFree: "Free" | "Not available";
    office?: OfficeDTO;
    pendingSchedules?: DeskScheduleDTO[];
}