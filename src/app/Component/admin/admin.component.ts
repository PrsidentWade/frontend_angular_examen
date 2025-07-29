import { Component, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../../Service/admin.service';
import { Tache } from '../../modele/tache';
import { Projet } from '../../modele/projet';
import { StatisticsResponse } from '../../modele/statistique';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  @ViewChild('tasksChart', { static: false }) tasksChart!: ElementRef;
  @ViewChild('projectsChart', { static: false }) projectsChart!: ElementRef;
  @ViewChild('usersChart', { static: false }) usersChart!: ElementRef;

  statistiques: StatisticsResponse['data'] | null = null;
  loading = true;
  error: string | null = null;

  // Propriétés pour l'affichage
  usersCount = 0;
  projetsCount = 0;
  tachesCount = 0;
  projetsRecents: Projet[] = [];
  tachesRecentes: Tache[] = [];

  // Charts
  tasksChartInstance: Chart | null = null;
  projectsChartInstance: Chart | null = null;
  usersChartInstance: Chart | null = null;

  constructor(private adminService: AdminService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadStatistiques();
  }

  loadStatistiques(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getSatistiques().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.statistiques = response.data;
          this.usersCount = response.data.users_count;
          this.projetsCount = response.data.projet_count;
          this.tachesCount = response.data.taks_count;
          this.projetsRecents = response.data.Project_recent;
          this.tachesRecentes = response.data.Taks_recent;

          // Créer les graphiques après avoir reçu les données
          setTimeout(() => {
            this.createCharts();
          }, 100);
        } else {
          this.error = 'Erreur lors du chargement des statistiques';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.error = 'Erreur de connexion au serveur';
        this.loading = false;
      }
    });
  }

  // Méthodes utilitaires pour l'affichage
  getTaskStatusText(etat: string): string {
    switch (etat) {
      case 'a_faire': return 'À faire';
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      default: return etat;
    }
  }

  getTaskStatusClass(etat: string): string {
    switch (etat) {
      case 'a_faire': return 'status-todo';
      case 'en_cours': return 'status-progress';
      case 'termine': return 'status-completed';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  refreshData(): void {
    this.destroyCharts();
    this.loadStatistiques();
  }

  createCharts(): void {
    this.createTasksChart();
    this.createProjectsChart();
    this.createUsersChart();
  }

  createTasksChart(): void {
    if (this.tasksChart?.nativeElement) {
      const ctx = this.tasksChart.nativeElement.getContext('2d');

      // Analyser les statuts des tâches
      const taskStatuses = { 'a_faire': 0, 'en_cours': 0, 'termine': 0 };
      this.tachesRecentes.forEach(task => {
        if (taskStatuses.hasOwnProperty(task.etat)) {
          taskStatuses[task.etat as keyof typeof taskStatuses]++;
        }
      });

      this.tasksChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['À faire', 'En cours', 'Terminé'],
          datasets: [{
            data: [taskStatuses.a_faire, taskStatuses.en_cours, taskStatuses.termine],
            backgroundColor: ['#ffc107', '#007bff', '#28a745'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            title: {
              display: true,
              text: 'Répartition des tâches',
              font: { size: 16, weight: 'bold' }
            }
          }
        }
      });
    }
  }

  createProjectsChart(): void {
    if (this.projectsChart?.nativeElement) {
      const ctx = this.projectsChart.nativeElement.getContext('2d');

      // Créer un graphique en barres pour les projets récents
      const projectNames = this.projetsRecents.slice(0, 5).map(p => p.nom_project);
      const projectData = this.projetsRecents.slice(0, 5).map((p, index) => index + 1);

      this.projectsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: projectNames,
          datasets: [{
            label: 'Projets récents',
            data: projectData, // Numéro d'ordre des projets
            backgroundColor: 'rgba(0, 123, 255, 0.7)',
            borderColor: '#007bff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Projets récents',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              display: false
            },
            x: {
              ticks: {
                maxRotation: 45
              }
            }
          }
        }
      });
    }
  }

  createUsersChart(): void {
    if (this.usersChart?.nativeElement) {
      const ctx = this.usersChart.nativeElement.getContext('2d');

      // Graphique simple avec les statistiques générales
      this.usersChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Utilisateurs', 'Projets', 'Tâches'],
          datasets: [{
            data: [this.usersCount, this.projetsCount, this.tachesCount],
            backgroundColor: ['#28a745', '#007bff', '#ffc107'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            title: {
              display: true,
              text: 'Vue d\'ensemble',
              font: { size: 16, weight: 'bold' }
            }
          }
        }
      });
    }
  }

  destroyCharts(): void {
    if (this.tasksChartInstance) {
      this.tasksChartInstance.destroy();
      this.tasksChartInstance = null;
    }
    if (this.projectsChartInstance) {
      this.projectsChartInstance.destroy();
      this.projectsChartInstance = null;
    }
    if (this.usersChartInstance) {
      this.usersChartInstance.destroy();
      this.usersChartInstance = null;
    }
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }
}

