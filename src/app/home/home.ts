import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  constructor(private router: Router) {}

  goToRendezVous() {
    this.router.navigate(['/services']);
  }

  ngOnInit(): void {
   
  }
  
}
