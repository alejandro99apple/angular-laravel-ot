import { Injectable } from '@angular/core';
import { System } from '../models/system.model';
import { SubSystem } from '../models/sub-system.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {


  constructor(
    private httpClient:HttpClient ,

  ) { }


  private systems: System[] = [];
  private subSystems: SubSystem[] = [];
  private workers: Worker[] = [];

  //--Anno y Mes para filtrar las ordenes de trabajo
  private year!:number;
  private month!:string;

  getfilterDates(){
    return {year:this.year,month:this.month}
  }
  
  setfilterDates(year:number,month:string){
    this.year = year;
    this.month = month;
  }



  //-- Seccion para obtener los nombre de los trabajadores
  generateWorkers(){
    this.httpClient.get<Worker[]>(environment.apiUrl+'/api/getWorkers').subscribe(
      (response)=>{
        this.workers = response;
        sessionStorage.setItem('workers',JSON.stringify(this.workers))
      },
      (error)=>{console.log(error)}
    )
  }

  getWorkers(){
    return JSON.parse(sessionStorage.getItem('workers')||'{}')
  }

  getUser(){
    return JSON.parse(localStorage.getItem('user')||'{}')
  }

  getWorker(id:number){
    let workers = JSON.parse(sessionStorage.getItem('workers')||'{}')
    for(let worker of workers){
      if(worker.id === id){
        return worker
      }
    }
  }

  //-- Seccion para obtener los nombre de los sistemas y subsistemas al iniciar la app
  generateSystemsAndSubSystems(){

    this.httpClient.get<any>(environment.apiUrl+'/api/generateSystems').subscribe(
      (response)=>{
        this.systems = response.systems;
        sessionStorage.setItem('systems',JSON.stringify(this.systems))
        this.subSystems = response.subSystems;
        sessionStorage.setItem('subSystems',JSON.stringify(this.subSystems))
      },
      (error)=>{console.log(error)}
    )
  }

  getSystems(){
    return JSON.parse(sessionStorage.getItem('systems')||'{}')
  }
  getSubSystems(){
    return JSON.parse(sessionStorage.getItem('subSystems')||'{}')
  }

  obtainSubSystemsPerSystem(system_id:number){
    this.subSystems = this.getSubSystems();
    this.systems = this.getSystems()
    let subSystems: SubSystem[] = [];

    this.subSystems.forEach(subSys => {
      if(subSys.system_id === system_id){
        subSystems.push(subSys)
      }
    });
    return subSystems;
  }

  obtainSystemName(system_id: number): string {
    this.systems = this.getSystems()
    const system = this.systems.find(s => s.id === system_id);
    return system ? system.name : 'No encontrado';
  }
  
  obtainSubSystemName(subSystem_id: number): string {
    this.subSystems = this.getSubSystems()
    const subsystem = this.subSystems.find(s => s.id === subSystem_id);
    return subsystem ? subsystem.name : 'No encontrado';
  }

  obtainSubSystemByID(id:number){
    let subSystems = this.getSubSystems();
    for(let subSys of subSystems){
      if(subSys.id === id){
        return subSys
      }
    }
  }

  obtainSystemByID(id:number){
    let systems = this.getSystems();
    for(let Sys of systems){
      if(Sys.id === id){
        return Sys
      }
    }
  }


}
