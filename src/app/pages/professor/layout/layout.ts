import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
