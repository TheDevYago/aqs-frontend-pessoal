import { CommonModule } from '@angular/common';
import {Component, inject} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})

export class Layout {
  private authService = inject(AuthService);
  private router = inject(Router);

  fazerLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
