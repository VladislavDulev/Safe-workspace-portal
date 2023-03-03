import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Desk } from "./desk.entity";
import { User } from "./user.entity";
import { Office } from "./office.entity";

@Entity('desk-schedule')
export class DeskSchedule {
    @PrimaryGeneratedColumn('increment')
    id:number;

    @ManyToOne(
        () => Office,
        office => office.desksSchedule
    )
    office: Office;

    @ManyToOne(
        () => Desk,
        desk => desk.schedule
    )
    desk: Desk;

    @ManyToOne(
        () => User,
        user => user.deskSchedule
    )
    user: User;

    @Column()
    dateStart: Date;

    @Column()
    dateEnd: Date;
}