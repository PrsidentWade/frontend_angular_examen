import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginData } from '../modele/login';
import { RegisterData } from '../modele/register';
import { environnement } from '../environnement/environnement';
import { User } from '../modele/user';


@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http: HttpClient) { }

  // 🔐 Login
  login(data: LoginData): Observable<LoginData> {
    return this.http.post<LoginData>(`${environnement.ApiUrl}/login`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    });
  }

  // 👤 Register
  register(data: RegisterData): Observable<RegisterData> {
    return this.http.post<RegisterData>(`${environnement.ApiUrl}/register`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    });
  }

  // 🚪 Logout (nécessite le token JWT dans les headers)
  logout(): Observable<any> {
    return this.http.post<any>(`${environnement.ApiUrl}/logout`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    });
  }

  // 💾 Sauvegarder le token JWT
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // 💾 Sauvegarder les informations utilisateur
  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // 📥 Récupérer les informations utilisateur
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // 📥 Récupérer le token JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🗑️ Supprimer le token
  removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // ✅ Vérifier si l'utilisateur est connecté
  isAuthenticated(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  }


  // 👑 Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environnement.ApiUrl}/getUsers`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        })
      }

    )
  }
}
