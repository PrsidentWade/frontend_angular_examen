import { Component, OnInit } from '@angular/core';
import { TacheService } from '../../Service/tache.service';
import { Tache } from '../../modele/tache';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Projet } from '../../modele/projet';
import { User } from '../../modele/user';
import { ProjetService } from '../../Service/projet.service';
import { AuthserviceService } from '../../Service/authservice.service';

@Component({
  selector: 'app-tache',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tache.component.html',
  styleUrls: ['./tache.component.css']
})
export class TacheComponent implements OnInit {
  taches: Tache[] = [];
  projets: Projet[] = [];
  users: User[] = [];
  tacheForm!: FormGroup;
  isEditing = false;
  showModal = false;
  currentTacheId: number | null = null;
  showDeleteModal = false;
  tacheToDelete: Tache | null = null;
  loading = true;

  constructor(private tacheService: TacheService, private fb: FormBuilder, private projetService: ProjetService, private userService: AuthserviceService) { }
  ngOnInit() {
    this.initForm();
    this.chargerTaches();
    this.chargerProjets();
    if (this.userService.isAdmin()) {
      this.chargerUsers();
    }
  }

  initForm() {
    this.tacheForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      etat: ['a_faire', Validators.required],
      deadline: ['', Validators.required], // Ajout de la validation si nécessaire
      project_id: [null, Validators.required],
      assigned_to: [null, Validators.required],
    });
  }

  chargerTaches() {
    this.tacheService.getTache().subscribe({
      next: (res: any) => {
        this.taches = res.taches || res.data || [];
        this.loading = false;
        console.log('Tâches chargées:', this.taches);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tâches:', err);
        this.loading = false;
      },
    });
  }

  chargerProjets() {
    console.log('🔄 Début du chargement des projets...');

    this.projetService.getProjets().subscribe({
      next: (res: any) => {
        console.log('📦 Réponse complète de l\'API projets:', res);

        // CORRECTION : Votre API renvoie les données dans la clé 'project' (singulier)
        this.projets = res.project || []; // ← La clé correcte est 'project'

        console.log('✅ Projets assignés:', this.projets);
        console.log('Nombre de projets:', this.projets.length);

        // Vérifiez le contenu du premier projet pour s'assurer de la structure
        if (this.projets.length > 0) {
          console.log('Premier projet:', this.projets[0]);
          console.log('Propriétés disponibles:', Object.keys(this.projets[0]));
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération des projets:', err);
      },
    });
  }

  chargerUsers() { // Correction du nom de la méthode
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.users || res.data || [];
        console.log('Utilisateurs chargés:', this.users); // Debug
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
      },
    });
  }

  getLabelEtat(etat: string): string {
    switch (etat) {
      case 'a_faire':
        return 'À faire';
      case 'en_cours':
        return 'En cours';
      case 'termine':
        return 'Terminé';
      default:
        return etat;
    }
  }
  // Ouvrir la modale pour ajouter une nouvelle tâche
  ouvrirModalAjout() {
    this.isEditing = false;
    this.currentTacheId = null;
    this.tacheForm.reset();
    this.tacheForm.patchValue({ etat: 'a_faire' });
    this.showModal = true;
  }

  // Ouvrir la modale pour modifier une tâche
  ouvrirModalModification(tache: Tache) {
    this.isEditing = true;
    this.currentTacheId = tache.id || null;

    // Formater la date pour l'input datetime-local
    let deadlineFormatted = '';
    if (tache.deadline) {
      const date = new Date(tache.deadline);
      deadlineFormatted = date.toISOString().slice(0, 16);
    }

    this.tacheForm.patchValue({
      titre: tache.titre,
      description: tache.description,
      etat: tache.etat,
      deadline: deadlineFormatted,
      project_id: tache.project_id,
      assigned_to: tache.assigned_to,
    });

    this.showModal = true;
  }
  // Fermer la modale
  fermerModal() {
    this.showModal = false;
    this.isEditing = false;
    this.currentTacheId = null;
    this.tacheForm.reset();
  }
  // Soumettre le formulaire (ajout ou modification)
  onSubmit() {
    if (this.tacheForm.valid) {
      const formData = this.tacheForm.value;

      if (this.isEditing && this.currentTacheId) {
        // Modification
        const data = { ...formData, id: this.currentTacheId };
        this.tacheService.Udapte(data).subscribe({
          next: (res) => {
            console.log('Tâche modifiée avec succès');
            this.chargerTaches();
            this.fermerModal();
          },
          error: (err) => {
            console.error('Erreur lors de la modification:', err);
          }
        });
      } else {
        // Ajout
        this.tacheService.AddTache(formData).subscribe({
          next: (res) => {
            console.log('Tâche créée avec succès');
            this.chargerTaches();
            this.fermerModal();
          },
          error: (err) => {
            console.error('Erreur lors de la création:', err);
          }
        });
      }
    } else {
      console.log('Formulaire invalide');
      this.marquerChampsCommeTouches();
    }
  }
  // Marquer tous les champs comme touchés pour afficher les erreurs
  marquerChampsCommeTouches() {
    Object.keys(this.tacheForm.controls).forEach(key => {
      this.tacheForm.get(key)?.markAsTouched();
    });
  }
  // Ouvrir la modale de confirmation de suppression
  ouvrirModalSuppression(tache: Tache) {
    this.tacheToDelete = tache;
    this.showDeleteModal = true;
  }

  // Fermer la modale de suppression
  fermerModalSuppression() {
    this.showDeleteModal = false;
    this.tacheToDelete = null;
  }

  // Confirmer la suppression
  confirmerSuppression() {
    if (this.tacheToDelete && this.tacheToDelete.id) {
      this.tacheService.deleteTache(this.tacheToDelete.id).subscribe({
        next: (res) => {
          console.log('Tâche supprimée avec succès');
          this.chargerTaches();
          this.fermerModalSuppression();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
        }
      });
    }
  }

  // Vérifier si un champ a une erreur
  hasError(fieldName: string): boolean {
    const field = this.tacheForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Obtenir le message d'erreur pour un champ
  getErrorMessage(fieldName: string): string {
    const field = this.tacheForm.get(fieldName);
    if (field?.errors?.['required']) {
      return `${fieldName} est requis`;
    }
    return '';
  }

}
