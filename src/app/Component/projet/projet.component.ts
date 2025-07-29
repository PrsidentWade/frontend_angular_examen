import { Component, OnInit } from '@angular/core';
import { Projet } from '../../modele/projet';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjetService } from '../../Service/projet.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../../Service/authservice.service';
import { User } from '../../modele/user';
// Pour utiliser Bootstrap modal


@Component({
  selector: 'app-projet',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.css'
})
export class ProjetComponent implements OnInit {
  projets: Projet[] = [];
  users: User[] = [];
  projetForm!: FormGroup;
  editMode: boolean = false;
  selectedProjetId: number | null = null;
  loading = true;
  showModal = false; // Contrôle l'affichage de la modal

  constructor(private projetService: ProjetService, private fb: FormBuilder, private autheservice: AuthserviceService) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchProjets();
    if (this.autheservice.isAdmin()) {
      this.chargerUsers();
    }
  }

  initForm() {
    this.projetForm = this.fb.group({
      nom_project: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  fetchProjets() {
    this.projetService.getProjets().subscribe({
      next: (res: any) => {
        this.projets = res.project || res.data || [];
        this.loading = false;
        console.log('Projets chargés:', this.projets);
      },
      error: (err) => {
        console.error('Erreur chargement projets', err);
        this.loading = false;
      }
    });
  }

  chargerUsers() {
    this.autheservice.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.users || res.data || [];
        console.log('Utilisateurs chargés:', this.users);
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs', err);
      }
    })
  }

  // Ouvrir la modal
  openModal(mode: 'add' | 'edit', projet?: Projet) {
    if (mode === 'edit' && projet) {
      this.projetForm.patchValue(projet);
      this.selectedProjetId = projet.id;
      this.editMode = true;
    } else {
      this.resetForm();
      this.editMode = false;
    }
    this.showModal = true;
    // Ajouter la classe modal-open au body pour empêcher le scroll
    document.body.classList.add('modal-open');
  }

  // Fermer la modal
  closeModal() {
    this.showModal = false;
    this.resetForm();
    // Retirer la classe modal-open du body
    (document.activeElement as HTMLElement)?.blur();
  }

  onSubmit() {
    if (this.projetForm.valid) {
      if (this.editMode && this.selectedProjetId !== null) {
        this.projetService.UpdateProjet(this.selectedProjetId, this.projetForm.value).subscribe({
          next: () => {
            this.fetchProjets();
            this.closeModal();
            console.log('Projet mis à jour avec succès');
          },
          error: (err) => {
            console.error('Erreur mise à jour projet', err);
          }
        });
      } else {
        this.projetService.AddProjet(this.projetForm.value).subscribe({
          next: () => {
            this.fetchProjets();
            this.closeModal();
            console.log('Projet ajouté avec succès');
          },
          error: (err) => {
            console.error('Erreur ajout projet', err);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onEdit(projet: Projet) {
    this.openModal('edit', projet);
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      this.projetService.DeleteProjet(id).subscribe({
        next: () => {
          this.fetchProjets();
          console.log('Projet supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur suppression projet', err);
        }
      });
    }
  }

  resetForm() {
    this.projetForm.reset();
    this.editMode = false;
    this.selectedProjetId = null;
  }

  private markFormGroupTouched() {
    Object.keys(this.projetForm.controls).forEach(key => {
      const control = this.projetForm.get(key);
      control?.markAsTouched();
    });
  }

  // Méthodes pour le tracking et l'affichage
  trackByProjectId(index: number, projet: Projet): number {
    return projet.id;
  }

  getProjectColor(id: number): string {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return colors[id % colors.length];
  }

  getProjectStatus(projet: Projet): string {
    // Implémentation basique - peut être étendue
    return 'En cours';
  }

  getTaskCount(projectId: number): number {
    // Implémentation basique - retourne 0 pour l'instant
    return 0;
  }

  getCompletedTasks(projectId: number): number {
    // Implémentation basique - retourne 0 pour l'instant
    return 0;
  }

  getTeamSize(projectId: number): number {
    // Implémentation basique - retourne 1 pour l'instant
    return 1;
  }

  getProjectProgress(projectId: number): number {
    // Implémentation basique - retourne un pourcentage aléatoire basé sur l'ID
    return Math.floor((projectId % 10) * 10) + 10;
  }

  // Méthodes utilitaires pour le template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.projetForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.projetForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `Le ${fieldName === 'nom_project' ? 'nom du projet' : fieldName} est requis`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        const fieldLabel = fieldName === 'nom_project' ? 'nom du projet' : fieldName;
        return `Le ${fieldLabel} doit contenir au moins ${requiredLength} caractères`;
      }
    }
    return '';
  }

}
