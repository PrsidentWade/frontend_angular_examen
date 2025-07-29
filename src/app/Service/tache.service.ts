import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tache } from '../modele/tache';
import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  constructor(private http: HttpClient) { }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
  }

  getTache(): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${environnement.ApiUrl}/tache`, this.getHeaders());
  }

  getTacheById(id: number): Observable<Tache> {
    return this.http.get<Tache>(`${environnement.ApiUrl}/tache/${id}`, this.getHeaders());
  }

  AddTache(tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${environnement.ApiUrl}/tache`, tache, this.getHeaders());
  }

  Udapte(tache: Tache): Observable<Tache> {
    return this.http.put<Tache>(`${environnement.ApiUrl}/tache/${tache.id}`, tache, this.getHeaders());
  }

  deleteTache(id: number): Observable<Tache> {
    return this.http.delete<Tache>(`${environnement.ApiUrl}/tache/${id}`, this.getHeaders());
  }
}
