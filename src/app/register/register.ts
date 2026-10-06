import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { Registerservice } from '../registerservice';

@Component({
  selector: 'app-register',
  imports: [FormsModule,CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullname = '';
  email = '';
  phone = '';
  password = '';

  userName: string | null = null;

  constructor(private registerservice: Registerservice, private router: Router) {}

  async submit() {
    if (!this.fullname || !this.email || !this.phone || !this.password) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const res: any = await this.registerservice.register({
        fullname: this.fullname,
        email: this.email,
        phone: this.phone,
        password: this.password
      });

      if (res.status === 'success') {
        alert("Compte créé avec succès !");
        this.userName = this.fullname;

        this.fullname = '';
        this.email = '';
        this.phone = '';
        this.password = '';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);

      } else {
        alert("Erreur");
      }

    } catch (err: any) {
      if (err.status === 409) {
        alert("Email déjà utilisé !");
      } else {
        alert("Erreur serveur");
      }
    }
  }
}
