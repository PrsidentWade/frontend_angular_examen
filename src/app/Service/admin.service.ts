import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environnement } from '../environnement/environnement';
import { User } from '../modele/user';
import { Observable } from 'rxjs/internal/Observable';
import { Projet } from '../modele/projet';
import { Tache } from '../modele/tache';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }
  }

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environnement.ApiUrl}/getUsers`, this.getHeaders());
  }
  getSatistiques() {
    return this.http.get<any[]>(`${environnement.ApiUrl}/statistique`, this.getHeaders());
  }
  CountUsers() {
    return this.http.get<any[]>(`${environnement.ApiUrl}/countusers`, this.getHeaders());
  }
  CounProjets() {
    return this.http.get<any[]>(`${environnement.ApiUrl}/countprojet`, this.getHeaders());
  }
  CountTache() {
    return this.http.get<any[]>(`${environnement.ApiUrl}/counttache`, this.getHeaders());
  }
  Tacherecent() {
    return this.http.get<Tache[]>(`${environnement.ApiUrl}/tacheRecent`, this.getHeaders());
  }
  ProjetRecent(): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${environnement.ApiUrl}/projetRecent`, this.getHeaders());
  }
}
