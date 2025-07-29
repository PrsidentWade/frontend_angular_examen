import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthserviceService } from '../../Service/authservice.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router, private authservice: AuthserviceService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    // Forcer la détection de changement après l'initialisation
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  isAdmin(): boolean {
    return this.authservice.isAdmin();
  }

  getCurrentUser() {
    return this.authservice.isAuthenticated();
  }
  logout() {
    this.authservice.logout().subscribe({
      next: () => {
        this.authservice.removeToken(); // Supprime le token localement
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authservice.removeToken();
        this.router.navigate(['/login']);
      }
    });
  }


}
