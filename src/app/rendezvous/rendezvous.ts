import { Component, OnInit } from '@angular/core';
import { Rendezvousservice } from '../rendezvousservice';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

interface TimeSlot {
  time: string;
  booked: boolean;
}

@Component({
  selector: 'app-rendezvous',
  standalone: true,
  templateUrl: './rendezvous.html',
  styleUrls: ['./rendezvous.css'],
  imports: [FormsModule, CommonModule]
})
export class RendezvousComponent implements OnInit {

  vehicles: any[] = [];
  selectedVehicleId: string = '';
  selectedVehicle: any | null = null;

  currentUserId: number | null = null;

  selectedDate: string = '';
  minDate: string = '';
  timeSlots: TimeSlot[] = [];
  selectedTime: string = '';
  loadingSlots = false;

  services: any[] = [];
  selectedServiceId: number | null = null;
  selectedServiceName: string = '';
  servicePrice: number | null = null;

  notes: string = '';

  errorMessage = '';
  successMessage = '';

  showPayment = false;
  pendingPayload: any = null;

  paymentMethod: string = 'card';
  cardHolder: string = '';
  cardNumber: string = '';
  cardExpiry: string = '';
  cardCvv: string = '';

  lastReceiptPayload: any = null;
  showThankYou = false;

  constructor(private rendezvousservice: Rendezvousservice) {}

  ngOnInit(): void {
    this.setMinDateToday();

    const userIdStr = localStorage.getItem('user_id');
    if (userIdStr) {
      this.currentUserId = +userIdStr;
      this.loadVehicles(this.currentUserId);
      this.loadServices();
    } else {
      this.errorMessage = 'Utilisateur non connecté.';
    }
  }

  openThankYou(): void { this.showThankYou = true; }
  closeThankYou(): void { this.showThankYou = false; }

  setMinDateToday(): void {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.minDate = `${yyyy}-${mm}-${dd}`;
  }

  loadVehicles(userId: number): void {
    this.rendezvousservice.getUserVehicles(userId).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.vehicles = res.vehicles || [];
          if (this.vehicles.length === 1) {
            this.selectedVehicleId = this.vehicles[0].id;
            this.selectedVehicle = this.vehicles[0];
          }
        } else {
          this.errorMessage = res.message || 'Erreur chargement véhicules.';
        }
      },
      error: () => this.errorMessage = 'Erreur chargement véhicules.'
    });
  }

  loadServices(): void {
    this.rendezvousservice.getServices().subscribe({
      next: (res: any) => {
        if (res?.status === 'success') {
          this.services = res.data || [];
        } else {
          this.errorMessage = res?.message || 'Erreur chargement services.';
        }
      },
      error: () => this.errorMessage = 'Erreur serveur chargement services.'
    });
  }

  onVehicleChange(): void {
    this.selectedVehicle =
      this.vehicles.find(v => v.id == this.selectedVehicleId) || null;
  }

  onDateChange(): void {
    this.selectedTime = '';
    this.timeSlots = [];
    this.errorMessage = '';

    if (!this.selectedDate) return;

    this.loadingSlots = true;
    this.rendezvousservice.getAvailability(this.selectedDate).subscribe({
      next: (res: any) => {
        this.loadingSlots = false;
        if (res.status === 'success') {
          this.timeSlots = res.slots || [];
        } else {
          this.errorMessage = res.message || 'Erreur créneaux.';
        }
      },
      error: () => {
        this.loadingSlots = false;
        this.errorMessage = 'Erreur serveur créneaux.';
      }
    });
  }

  selectSlot(slot: TimeSlot): void {
    if (slot.booked) return;
    this.selectedTime = slot.time;
  }

  updatePrice(): void {
    const service = this.services.find(
      s => Number(s.id) === Number(this.selectedServiceId)
    );
    this.selectedServiceName = service ? service.name : '';
    this.servicePrice = service ? Number(service.price) : null;
  }

  goToPayment(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentUserId) {
      this.errorMessage = 'Utilisateur non connecté.';
      return;
    }

    if (!this.selectedVehicleId) {
      this.errorMessage = 'Veuillez sélectionner un véhicule.';
      return;
    }

    if (!this.selectedDate) {
      this.errorMessage = 'Veuillez choisir une date.';
      return;
    }

    if (!this.selectedTime) {
      this.errorMessage = 'Veuillez choisir un créneau horaire.';
      return;
    }

    if (!this.selectedServiceId) {
      this.errorMessage = 'Veuillez sélectionner un service.';
      return;
    }

    this.updatePrice();
    if (!this.selectedServiceName || this.servicePrice === null) {
      this.errorMessage = 'Service invalide.';
      return;
    }

    this.pendingPayload = {
      user_id: this.currentUserId,
      vehicle_id: +this.selectedVehicleId,
      service_id: this.selectedServiceId,
      service: this.selectedServiceName,
      price: this.servicePrice,
      notes: this.notes,
      date_rdv: this.selectedDate,
      heure_rdv: this.selectedTime
    };

    this.showPayment = true;
  }

  confirmPayment(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.pendingPayload) {
      this.errorMessage = 'Aucun rendez-vous en attente.';
      return;
    }

    if (this.paymentMethod === 'card') {
      if (!this.cardHolder || !this.cardNumber || !this.cardExpiry || !this.cardCvv) {
        this.errorMessage = 'Veuillez remplir les infos carte.';
        return;
      }
    }

    const finalPayload = {
      ...this.pendingPayload,
      payment_method: this.paymentMethod,
      payment_status: 'paid'
    };

    this.rendezvousservice.createRendezvous(finalPayload).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.lastReceiptPayload = finalPayload;
          this.successMessage = 'Rendez-vous confirmé.';
          this.openThankYou();

          this.showPayment = false;
          this.pendingPayload = null;

          this.cardHolder = '';
          this.cardNumber = '';
          this.cardExpiry = '';
          this.cardCvv = '';

          this.notes = '';
          this.selectedServiceId = null;
          this.selectedServiceName = '';
          this.servicePrice = null;
          this.selectedTime = '';

          this.onDateChange();
        } else {
          this.errorMessage = res.message || 'Erreur enregistrement.';
        }
      },
      error: (err) => {
        if (err?.status === 409) {
          this.errorMessage = 'Créneau déjà réservé.';
          this.onDateChange();
        } else {
          this.errorMessage = 'Erreur serveur.';
        }
      }
    });
  }

   downloadReceipt() {
    if (!this.lastReceiptPayload) return;
    this.generateReceiptPdf(this.lastReceiptPayload);
  }

  private generateReceiptPdf(payload: any) {
    const doc = new jsPDF();
    const vehicle = this.vehicles.find(v => v.id == payload.vehicle_id);
    const primaryColor = [33, 150, 243]; 
    const secondaryColor = [69, 90, 100]; 

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AutoFix Garage', 15, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Votre partenaire de confiance pour l\'entretien automobile', 15, 33);

    doc.setFontSize(12);
    doc.text('REÇU DE PAIEMENT', 150, 25, { align: 'left' });
    doc.text(`#RDV-${Date.now().toString().slice(-6)}`, 150, 33, { align: 'left' });

  
    let y = 55;
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);


    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAILS DU REÇU', 15, y);
    doc.line(15, y + 2, 200, y + 2);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.text(`Date d'émission :`, 15, y);
    doc.text(new Date().toLocaleString(), 50, y);
    y += 7;
    doc.text(`Client ID :`, 15, y);
    doc.text(`${payload.user_id}`, 50, y);
    y += 15;

    if (vehicle) {
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMATIONS VÉHICULE', 15, y);
      doc.line(15, y + 2, 200, y + 2);
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.text(`Marque :`, 15, y);
      doc.text(`${vehicle.make}`, 50, y);
      y += 7;
      doc.text(`Modèle :`, 15, y);
      doc.text(`${vehicle.model || 'N/A'}`, 50, y);
      y += 7;
      doc.text(`VIN / Plaque :`, 15, y);
      doc.text(`${vehicle.vin}`, 50, y);
      y += 15;
    }

    
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAILS DE L\'INTERVENTION', 15, y);
    doc.line(15, y + 2, 200, y + 2);
    y += 10;

 
    doc.setFillColor(245, 245, 245);
    doc.rect(15, y - 5, 185, 8, 'F');
    doc.text('Description', 20, y);
    doc.text('Date & Heure', 100, y);
    doc.text('Montant', 170, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.text(`${payload.service}`, 20, y);
    doc.text(`${payload.date_rdv} à ${payload.heure_rdv}`, 100, y);
    doc.text(`${payload.price} DT`, 170, y);
    y += 10;

    if (payload.notes) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text(`Notes : ${payload.notes}`, 20, y);
      doc.setFontSize(10);
      y += 10;
    }

 
    y += 10;
    doc.rect(130, y, 70, 25);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAYÉ', 135, y + 10);
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${payload.price} DT`, 135, y + 18);

    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`Méthode : ${payload.payment_method === 'card' ? 'Carte Bancaire' : 'Espèces'}`, 15, y + 10);
    doc.text(`Statut : Payé`, 15, y + 18);

 
    y = 280;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('AutoFix Garage - 123 Rue de la Mécanique, Tunis - Tel: +216 71 000 000', 105, y, { align: 'center' });
    doc.text('Merci pour votre confiance !', 105, y + 5, { align: 'center' });

    const fileName = `recu-rdv-${payload.date_rdv}.pdf`;
    doc.save(fileName);
  }
}
