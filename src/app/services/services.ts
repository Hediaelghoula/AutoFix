import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Ser, Service } from '../ser';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css'],
})
export class ServicesComponent {
  services: Service[] = [];

  constructor(private ser: Ser, private router: Router) {
    this.services = this.ser.getServices();
  }

  trackById(index: number, item: Service): number {
    return item.id;
  }

bookService(): void {
  this.router.navigate(['/login']);
}

    

}
