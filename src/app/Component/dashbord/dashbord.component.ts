import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../../Service/authservice.service';
import { ProjetService } from '../../Service/projet.service';
import { TacheService } from '../../Service/tache.service';
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashbord',
  imports: [CommonModule],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('statsChart') statsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('projectChart') projectChartRef!: ElementRef<HTMLCanvasElement>;

  userCount: number = 0;
  projetCount: number = 0;
  tacheCount: number = 0;
  
  loading: boolean = true;
  error: string | null = null;

  statsChart: Chart | null = null;
  projectChart: Chart | null = null;

  constructor(private authservice: AuthserviceService, private projetservice: ProjetService, private tacheservice: TacheService) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    // Charger projets et tâches
    forkJoin({
      projets: this.projetservice.getProjets(),
      taches: this.tacheservice.getTache()
    }).subscribe({
      next: (results) => {
        this.projetCount = results.projets.length;
        this.tacheCount = results.taches.length;
        
        if (this.authservice.isAdmin()) {
          this.loadUsers();
        } else {
          this.loading = false;
          setTimeout(() => {
            this.createCharts();
          }, 100);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données:', err);
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    this.authservice.getUsers().subscribe({
      next: (users) => {
        this.userCount = users.length;
        this.loading = false;
        setTimeout(() => {
          this.createCharts();
        }, 100);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        this.loading = false;
        setTimeout(() => {
          this.createCharts();
        }, 100);
      }
    });
  }

  ngAfterViewInit(): void {
    // Les graphiques seront créés après le chargement des données
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  destroyCharts(): void {
    if (this.statsChart) {
      this.statsChart.destroy();
      this.statsChart = null;
    }
    if (this.projectChart) {
      this.projectChart.destroy();
      this.projectChart = null;
    }
  }

  refreshData(): void {
    this.destroyCharts();
    this.loadData();
  }

  createCharts() {
    this.createStatsChart();
    this.createProjectChart();
  }

  createStatsChart() {
    if (this.statsChartRef) {
      const ctx = this.statsChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.statsChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Projets', 'Tâches', 'Utilisateurs'],
            datasets: [{
              data: [this.projetCount, this.tacheCount, this.userCount],
              backgroundColor: [
                '#3B82F6',
                '#10B981',
                '#F59E0B'
              ],
              borderWidth: 2,
              borderColor: '#ffffff'
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
                  font: {
                    size: 12
                  }
                }
              }
            }
          }
        });
      }
    }
  }

  createProjectChart() {
    if (this.projectChartRef) {
      const ctx = this.projectChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.projectChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Projets', 'Tâches', 'Utilisateurs'],
            datasets: [{
              label: 'Statistiques',
              data: [this.projetCount, this.tacheCount, this.userCount],
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)'
              ],
              borderColor: [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    }
  }



}
