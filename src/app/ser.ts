import { Injectable } from '@angular/core';

export interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
  estimatedDuration: string;
  priceRange?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Ser {
private services: Service[] = [
  {
    id: 1,
    name: 'Entretien',
    description: 'Vidange, révision, contrôle général de votre véhicule. Service complet pour maintenir votre voiture en parfait état.',
    icon: 'build',
    estimatedDuration: '1-2 heures',
    priceRange: '80 - 250 DT',
  },
  {
    id: 2,
    name: 'Réparation',
    description: 'Réparation mécanique ou électrique de votre voiture. Nos mécaniciens experts résolvent tous types de problèmes.',
    icon: 'settings',
    estimatedDuration: '2-4 heures',
    priceRange: '150 - 900 DT',
  },
  {
    id: 3,
    name: 'Diagnostic',
    description: 'Diagnostic complet pour détecter toute anomalie. Utilisation d’équipements modernes pour identifier les problèmes.',
    icon: 'search',
    estimatedDuration: '30-60 min',
    priceRange: '40 - 120 DT',
  },
  {
    id: 4,
    name: 'Intervention rapide',
    description: 'Petites réparations ou remplacements immédiats. Service express pour vos urgences automobiles.',
    icon: 'flash_on',
    estimatedDuration: '30 min - 1h',
    priceRange: '60 - 200 DT',
  },
  {
    id: 5,
    name: 'Pneumatique',
    description: 'Changement, équilibrage et réparation des pneus. Service complet pour la sécurité de vos pneus.',
    icon: 'tire_repair',
    estimatedDuration: '30-45 min',
    priceRange: '100 - 600 DT',
  },
  {
    id: 6,
    name: 'Nettoyage / Detailing',
    description: 'Lavage complet et entretien esthétique de votre voiture. Redonnez l’éclat à votre véhicule.',
    icon: 'local_car_wash',
    estimatedDuration: '1-3 heures',
    priceRange: '60 - 300 DT',
  },
  {
    id: 7,
    name: 'Climatisation',
    description: 'Recharge, entretien et réparation du système de climatisation pour un confort optimal toute l’année.',
    icon: 'ac_unit',
    estimatedDuration: '45 min - 1h30',
    priceRange: '120 - 450 DT',
  },
  {
    id: 8,
    name: 'Freinage',
    description: 'Contrôle et remplacement des plaquettes, disques et liquide de frein pour une sécurité maximale.',
    icon: 'warning',
    estimatedDuration: '1-2 heures',
    priceRange: '180 - 900 DT',
  },
  {
    id: 9,
    name: 'Batterie',
    description: 'Test, recharge ou remplacement de batterie. Intervention rapide en atelier ou sur place.',
    icon: 'battery_charging_full',
    estimatedDuration: '30-45 min',
    priceRange: '120 - 550 DT',
  },
  {
    id: 10,
    name: 'Électricité automobile',
    description: 'Réparation des pannes électriques, éclairage, capteurs, alternateur et démarreur.',
    icon: 'electric_bolt',
    estimatedDuration: '1-3 heures',
    priceRange: '120 - 1200 DT',
  },
  {
    id: 11,
    name: 'Pré-contrôle technique',
    description: 'Vérification complète avant contrôle technique pour éviter les contre-visites.',
    icon: 'fact_check',
    estimatedDuration: '45 min - 1h',
    priceRange: '60 - 180 DT',
  },
  {
    id: 12,
    name: 'Dépannage',
    description: 'Assistance rapide en cas de panne : démarrage, crevaison, petite réparation d’urgence.',
    icon: 'car_repair',
    estimatedDuration: '30 min - 1h',
    priceRange: '80 DT',
  },
];
  getServices(): Service[] {
    return this.services;
  }
}
