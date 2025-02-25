import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { LoaderComponent } from '../../loader/loader/loader.component';

@Component({
  selector: 'app-home-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    LoaderComponent
  ],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {
  protected authService = inject(AuthService);
  protected router = inject(Router);
  menuOpen = false;


  constructor() {
    this.authService.getUser().subscribe(_ => {
    });
  }

  logout() {
    this.authService.logout().subscribe(res => {
      if (!res) return;
      this.router.navigate(['/login']);
    });
  }

  nouveauArticle() {
    this.router.navigate(['/article/nouveau']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
