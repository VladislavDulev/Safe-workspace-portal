import { IsDateString, IsNotEmpty } from "class-validator";
export class VacationDTO {
  @IsNotEmpty()
  @IsDateString()  
  start: string;

  @IsNotEmpty()
  @IsDateString()
  end: string;
}