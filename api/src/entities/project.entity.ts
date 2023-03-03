import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Office } from "./office.entity";
@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    title: string;

    @Column('nvarchar')
    description: string;

    @OneToMany(
        () => User,
        user => user.project
    )
    users: User[];

    @ManyToOne(
        () => Office,
        office => office.projects
    )
    office: Office;

    @Column({ default: false })
    isFinished: boolean; 

    @Column({ type: 'boolean', default: false })
    isImportant: boolean;
}