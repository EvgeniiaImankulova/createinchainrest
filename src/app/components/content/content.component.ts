import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: string;
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
  metrics: MetricCard[] = [
    { title: 'Выручка', value: '569 019,00 ₽', change: '0 % к предыдущему периоду', trend: 'neutral' },
    { title: 'Чеки', value: '245', change: '0 % к предыдущему периоду', trend: 'neutral' },
    { title: 'Средний чек', value: '2 322,53 ₽', change: '0 % к предыдущему периоду', trend: 'neutral' },
    { title: 'Возвраты', value: '7', change: '0 % к предыдущему периоду', trend: 'neutral' },
    { title: 'Скидки', value: '6 437,00 ₽', change: '0 % к предыдущему периоду', trend: 'neutral' },
    { title: 'НДС', value: '0,00 ₽', change: '0 % к предыдущему периоду', trend: 'neutral' }
  ];
}
