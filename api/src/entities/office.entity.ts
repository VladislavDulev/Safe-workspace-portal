import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Project } from "./project.entity";
import { CountryEnum } from "src/common/enums/coutries.enum";
import { DeskSchedule } from "./desk-schedule.entity";
import { Desk } from "./desk.entity";


@Entity('offices')
export class Office {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true})
    name: string;

    @Column()
    deskPerCol: number;

    @Column()
    deskPerRow: number;

    @Column()
    rows: number;

    @Column()
    columns: number;

    @Column()
    distanceBetweenRows: number;

    @Column()
    distanceBetweenCols: number;

    @OneToMany(
        () => Desk,
        desk => desk.office
    )
    desks: Desk[];

    @OneToMany(
        () => DeskSchedule, 
        desk => desk.office
    )
    desksSchedule: DeskSchedule[];

    @Column({ unique: true })
    country: CountryEnum;

    @OneToMany(
        () => Project,
        project => project.office
    )
    projects: Project[];
}