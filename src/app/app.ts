import { Component } from '@angular/core';
import { MainContainerComponent } from './components/main-container/main-container';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'angular-receita-ai';
}