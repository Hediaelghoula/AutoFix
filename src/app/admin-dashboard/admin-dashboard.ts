import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../adminservice';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {

  tab = signal<'users' | 'appointments' | 'services'>('users');

  users = signal<any[]>([]);
  appointments = signal<any[]>([]);
  services = signal<any[]>([]);


  serviceForm = { id: null as number | null, name: '', price: 0 };
  editingService = false;

  errorUsers = signal('');
  errorAppointments = signal('');
  errorServices = signal('');
  successMessage = signal('');

  constructor(private adminservice: AdminService, private router: Router) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUsers();
    this.loadAppointments();
    this.loadServices();
  }

  setTab(t: 'users' | 'appointments' | 'services') {
    this.tab.set(t);
    this.successMessage.set('');
  }

  loadUsers() {
    this.errorUsers.set('');
    this.adminservice.getUsers().subscribe({
      next: (res: any) => this.users.set(res?.data || []),
      error: (err) => {
        console.error('users error', err);
        this.errorUsers.set(err?.error?.message || 'Erreur chargement utilisateurs');
      }
    });
  }

  loadAppointments() {
    this.errorAppointments.set('');
    this.adminservice.getAppointments().subscribe({
      next: (res: any) => this.appointments.set(res?.data || []),
      error: (err) => {
        console.error('appointments error', err);
        this.errorAppointments.set(err?.error?.message || 'Erreur chargement rendez-vous');
      }
    });
  }

  loadServices() {
    this.errorServices.set('');
    this.adminservice.getServices().subscribe({
      next: (res: any) => this.services.set(res?.data || []),
      error: (err) => {
        console.error('services error', err);
        this.errorServices.set(err?.error?.message || 'Erreur chargement services');
      }
    });
  }

  editService(s: any) {
    this.editingService = true;
    this.serviceForm = {
      id: s.id,
      name: s.name,
      price: Number(s.price)
    };
    this.successMessage.set('');
    this.errorServices.set('');
  }

  cancelEdit() {
    this.editingService = false;
    this.serviceForm = { id: null, name: '', price: 0 };
  }

  saveService() {
    this.errorServices.set('');
    this.successMessage.set('');

    if (!this.serviceForm.name || this.serviceForm.price === null) {
      this.errorServices.set('Nom et prix obligatoires');
      return;
    }

    const payload = {
      id: this.serviceForm.id,
      name: this.serviceForm.name.trim(),
      price: Number(this.serviceForm.price)
    };

    const call$ = this.editingService
      ? this.adminservice.updateService(payload)
      : this.adminservice.addService(payload);

    call$.subscribe({
      next: (res: any) => {
        if (res?.status === 'success') {
          this.successMessage.set(res?.message || 'OK');
          this.cancelEdit();
          this.loadServices();
        } else {
          this.errorServices.set(res?.message || 'Erreur');
        }
      },
      error: (err) => {
        console.error('save service error', err);
        this.errorServices.set(err?.error?.message || 'Erreur serveur');
      }
    });
  }
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }
  deleteService(id: number) {
    if (!confirm('Supprimer ce service ?')) return;

    this.adminservice.deleteService(id).subscribe({
      next: (res: any) => {
        if (res?.status === 'success') {
          this.loadServices();
        } else {
          this.errorServices.set(res?.message || 'Erreur suppression');
        }
      },
      error: (err) => {
        console.error('delete service error', err);
        this.errorServices.set(err?.error?.message || 'Erreur serveur suppression');
      }
    });
  }
}
