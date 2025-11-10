import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule',
  standalone: true,
  template: `
    <div class="view-container">
      <h1>Расписание</h1>
      <p>Расписание сотрудников</p>
    </div>
  `,
  styles: [`
    .view-container {
      padding: 24px;
    }
    h1 {
      font-size: 24px;
      font-weight: 500;
      margin: 0 0 16px 0;
      color: rgba(0, 0, 0, 0.87);
    }
  `]
})
export class ScheduleComponent {}
