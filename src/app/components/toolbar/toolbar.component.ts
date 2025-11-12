import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { DatePeriod, DatePeriodType } from '../../models/date-period.model';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  user: User = { username: 'vyartsev' };

  datePeriod: DatePeriod = {
    type: 'year',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 11, 31)
  };

  dateLabels: { type: DatePeriodType; label: string }[] = [
    { type: 'day', label: 'Д' },
    { type: 'week', label: 'Н' },
    { type: 'month', label: 'М' },
    { type: 'year', label: 'Г' },
    { type: 'custom', label: 'П' }
  ];

  onPeriodChange(type: DatePeriodType): void {
    this.datePeriod.type = type;
  }

  navigatePeriod(direction: 'prev' | 'next'): void {
    console.log('Navigate period:', direction);
  }

  openCalendar(): void {
    console.log('Open calendar');
  }

  getFormattedDateRange(): string {
    const startDate = this.datePeriod.startDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    const endDate = this.datePeriod.endDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    return `${startDate} - ${endDate}`;
  }
}
