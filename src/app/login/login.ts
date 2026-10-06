import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Authservice } from '../authservice';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'], 
})
export class Login {

  email = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  constructor(private authservice: Authservice, private router: Router) {}

  async submit() {
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const res: any = await this.authservice.login({
        email: this.email,
        password: this.password
      });

      console.log('Login response:', res);

      if (res?.status === 'success') {
        this.successMessage = res.message || 'Connexion réussie';

      
        localStorage.setItem('user_id', String(res.user.id));
        localStorage.setItem('user_name', res.user.fullname || '');
        localStorage.setItem('user_email', res.user.email || '');

  
        const role = res.user.role || 'user';
        localStorage.setItem('role', role);

   
        this.email = '';
        this.password = '';


        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }

      } else {
        this.errorMessage = res?.message || 'Erreur lors de la connexion';
      }

    } catch (err: any) {
      console.error('Login error:', err);

      if (err?.status === 401) {
        this.errorMessage = 'Email ou mot de passe incorrect';
      } else {
        this.errorMessage = err?.error?.message || err?.message || 'Erreur serveur';
      }
    }
  }
}
