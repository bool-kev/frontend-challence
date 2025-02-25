import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ICredentials } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  protected authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);
  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('')
  });
  protected invalidCrendntials = false;

  constructor() { }

  doLogin() {
    this.authService.login(this.form.value as ICredentials).subscribe((response) => {
      if (response) {
        if (history.length > 1) {
          this.location.back();
        } else {
          this.router.navigate(['/acceuil']);
        }
      } else {
        this.invalidCrendntials = true;
      }
    });
  }

}
