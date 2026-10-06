import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../vehicleservice';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-vehicle',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './loginvehicle.html',
  styleUrls: ['./loginvehicle.css']
})
export class LoginVehicle implements OnInit {

  makes: any[] = [];
  selectedMake = '';
  vin = '';

  registrationTypes: string[] = [];
  selectedRegistrationType = '';

  plateNumber = ''; 
  errorMessage = '';

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehicleService.getAllMakes().subscribe({
      next: (res: any) => this.makes = res.Results || [],
      error: (err) => console.error('Erreur récupération marques', err)
    });

    this.registrationTypes = this.vehicleService.getRegistrationTypes();
  }

  submit(): void {
    this.errorMessage = '';

    if (
      !this.selectedMake ||
      !this.vin ||
      !this.selectedRegistrationType ||
      !this.plateNumber
    ) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return;
    }

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.errorMessage = 'Session expirée, veuillez vous reconnecter.';
      this.router.navigate(['/login']);
      return;
    }

    const data = {
      make: this.selectedMake,
      vin: this.vin,
      registration_type: this.selectedRegistrationType,
      plate_number: this.plateNumber, // ✅ ENVOYÉ AU BACKEND
      user_id: Number(userId)
    };

    console.log('Données envoyées au serveur :', data);

    this.vehicleService.saveVehicle(data).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.router.navigate(['/rendezvous'], {
            queryParams: {
              vehicle_id: res.vehicle_id,
              vin: this.vin
            }
          });
        } else {
          this.errorMessage = res.message || 'Erreur serveur';
        }
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erreur serveur';
      }
    });
  }
}
