import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserRole } from 'src/common/enums/user-roles';
import { Project } from './project.entity';
import { CountryEnum } from 'src/common/enums/coutries.enum';
import { DeskSchedule } from './desk-schedule.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Column()
  fullname: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Basic,
  })
  role: UserRole;

  @ManyToOne(
    () => Project,
    project => project.users
  )
  project: Project;

  @OneToMany(
    () => DeskSchedule,
    schedule => schedule.user
  )
  deskSchedule: DeskSchedule[];
  
  @Column()
  country: CountryEnum;

  @Column({ nullable: true })
  vacationStart: Date;

  @Column({ nullable: true })
  vacationEnd: Date;

  @Column({ default: false })
  isBanned: boolean;
}
