import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('covid-data')
export class CovidData {
    
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({ nullable: true})
    country: string;
    
    @Column({ nullable: true })
    cases: number;
    
    @Column({ nullable: true})
    todayCases: number;
    
    @Column({ nullable: true})
    deaths: number;

    @Column({ nullable: true})
    todayDeaths: number;
    
    @Column({ nullable: true})
    recovered: number; 
    
    @Column({ nullable: true})
    active: number;
    
    @Column({ nullable: true})
    critical: number;
    
    @Column({ nullable: true})
    casesPerOneMillion: number;
    
    @Column({ nullable: true})
    deathsPerOneMillion: number;
    
    @Column({ nullable: true})
    totalTests: number;
    
    @Column({ nullable: true})
    testsPerOneMillion: number;

    @Column({ nullable: true })
    date: Date;
}