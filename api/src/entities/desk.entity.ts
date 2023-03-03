import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Office } from "./office.entity";
import { DeskSchedule } from "./desk-schedule.entity";

@Entity('desks')
export class Desk {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ default: "Free" })
    isFree: "Free" | "Not available";

    @ManyToOne(
        () => Office,
        office => office.desks    
    )
    office: Office;

    @OneToMany(
        () => DeskSchedule,
        schedule => schedule.desk
    )
    schedule: DeskSchedule[];
}