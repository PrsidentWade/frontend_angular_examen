import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environnement } from '../environnement/environnement';
import { Projet } from '../modele/projet';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  getAuthHeader() {
    return new HttpHeaders({
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  }

  constructor(private http: HttpClient) { }

  getProjets(): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${environnement.ApiUrl}/projet`, { headers: this.getAuthHeader() });
  }

  getProjetById(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${environnement.ApiUrl}/projet/${id}`, { headers: this.getAuthHeader() });
  }

  AddProjet(projet: Projet) {
    return this.http.post<Projet>(`${environnement.ApiUrl}/projet`, projet, { headers: this.getAuthHeader() });
  }
  UpdateProjet(id: number, projet: Projet) {
    return this.http.put(`${environnement.ApiUrl}/projet/${id}`, projet.id, { headers: this.getAuthHeader() });
  }
  DeleteProjet(id: number) {
    return this.http.delete(`${environnement.ApiUrl}/projet/${id}`, { headers: this.getAuthHeader() });
  }
}
