import { Component } from '@angular/core';

@Component({
  selector: 'app-stock',
  standalone: true,
  template: `
    <div class="view-container">
      <h1>Остатки на складе</h1>
      <p>Управление остатками на складе</p>
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
export class StockComponent {}
