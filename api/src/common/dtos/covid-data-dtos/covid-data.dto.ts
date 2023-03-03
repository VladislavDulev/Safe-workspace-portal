export class CovidDataDTO {
    id: number;
    
    country: string;
    
    cases: number;
    
    todayCases: number;
    
    deaths: number;

    todayDeaths: number;
    
    recovered: number; 
    
    active: number;
    
    critical: number;
    
    casesPerOneMillion: number;
    
    deathsPerOneMillion: number;
    
    totalTests: number;
    
    testsPerOneMillion: number;

    date: Date;
}