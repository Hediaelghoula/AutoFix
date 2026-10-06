import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../dashboardservice';

type DashboardStats = {
  vehicules: number;
  rendezvous: number;
  factures: number;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {

  username = signal<string>('Utilisateur');
  stats = signal<DashboardStats>({ vehicules: 0, rendezvous: 0, factures: 0 });

  loading = signal<boolean>(false);
  error = signal<string>('');
  deletingId = signal<number | null>(null);

  showVehiclesModal = signal<boolean>(false);
  showRendezvousModal = signal<boolean>(false);


  myVehicles = signal<any[]>([]);
  myRendezvous = signal<any[]>([]);
  modalLoading = signal<boolean>(false);
  modalError = signal<string>('');

  private userId: number | null = null;

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.username.set(localStorage.getItem('user_name') || 'Utilisateur');

    const userIdStr = localStorage.getItem('user_id');
    if (!userIdStr) {
      this.router.navigate(['/login']);
      return;
    }

    const uid = Number(userIdStr);
    if (!Number.isFinite(uid) || uid <= 0) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }

    this.userId = uid;
    this.fetchStats(uid);
  }

  fetchStats(userId: number): void {
    this.loading.set(true);
    this.error.set('');

    this.dashboardService.getStats(userId).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? {};
        this.stats.set({
          vehicules: Number(data.vehicules ?? data.vehicles ?? 0),
          rendezvous: Number(data.rendezvous ?? 0),
          factures: Number(data.factures ?? data.payments ?? 0),
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement stats :', err);
        this.loading.set(false);
        this.error.set('Erreur chargement statistiques');
      }
    });
  }

  openVehiclesModal(): void {
    if (!this.userId) return;

    this.showVehiclesModal.set(true);
    this.modalError.set('');
    this.modalLoading.set(true);

    this.dashboardService.getMyVehicles(this.userId).subscribe({
      next: (res: any) => {
        this.myVehicles.set(res?.data || []);
        this.modalLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur vehicles:', err);
        this.myVehicles.set([]);
        this.modalLoading.set(false);
        this.modalError.set('Erreur chargement véhicules');
      }
    });
  }

  closeVehiclesModal(): void {
    this.showVehiclesModal.set(false);
  }

  openRendezvousModal(): void {
    if (!this.userId) return;

    this.showRendezvousModal.set(true);
    this.modalError.set('');
    this.modalLoading.set(true);

    this.dashboardService.getMyRendezvous(this.userId).subscribe({
      next: (res: any) => {
        this.myRendezvous.set(res?.data || []);
        this.modalLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur rendezvous:', err);
        this.myRendezvous.set([]);
        this.modalLoading.set(false);
        this.modalError.set('Erreur chargement rendez-vous');
      }
    });
  }
deleteVehicle(v: any): void {
  if (!this.userId) return;

  const id = Number(v?.id ?? v?.vehicle_id);
  if (!Number.isFinite(id) || id <= 0) {
    this.modalError.set("Impossible de supprimer: ID véhicule introuvable.");
    return;
  }

  const ok = confirm(`Supprimer ce véhicule (${v?.make ?? ''}) ?`);
  if (!ok) return;

  this.deletingId.set(id);
  this.modalError.set('');

  this.dashboardService.deleteVehicle(id).subscribe({
    next: () => {
    
      this.myVehicles.set(this.myVehicles().filter(x => Number(x?.id ?? x?.vehicle_id) !== id));

    
      this.stats.set({
        ...this.stats(),
        vehicules: Math.max(0, this.stats().vehicules - 1),
      });

      this.deletingId.set(null);
    },
    error: (err) => {
      console.error('Erreur suppression véhicule:', err);
      this.modalError.set('Erreur suppression véhicule');
      this.deletingId.set(null);
    }
  });
}

  closeRendezvousModal(): void {
    this.showRendezvousModal.set(false);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }
}
