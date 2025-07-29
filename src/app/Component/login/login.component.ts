import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../Service/authservice.service';
import { LoginData } from '../../modele/login';
import { RegisterData } from '../../modele/register';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isLoginMode: boolean = true;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthserviceService, private router: Router) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['users', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
  }

  onSubmit() {
    this.loading = true;
    this.error = null;

    // Validation des formulaires
    const currentForm = this.isLoginMode ? this.loginForm : this.registerForm;
    if (currentForm.invalid) {
      this.error = 'Veuillez remplir tous les champs correctement.';
      this.loading = false;
      return;
    }

    if (this.isLoginMode) {
      const loginData: LoginData = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (res: any) => {
          this.authService.saveToken(res.token);
          this.authService.saveUser(res.user);
          console.log('Login success:', res.user);
          setTimeout(() => {
            this.router.navigate(['/home/projet']); // rediriger vers la page projet
          }, 1000);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Email ou mot de passe invalide.';
          this.loading = false;
        },
      });
    } else {
      const registerData: RegisterData = this.registerForm.value;
      console.log('Data being sent:', registerData);
      this.authService.register(registerData).subscribe({
        next: (res: any) => {
          console.log('Inscription réussie', res);
          this.loading = false;
          setTimeout(() => {
            this.toggleMode(); // revenir au login
          }, 1000);
        },
        error: (err) => {
          this.error = 'Erreur lors de l’inscription.';
          this.loading = false;
        },
      });
    }
  }


}
