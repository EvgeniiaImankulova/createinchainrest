import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-container">
      <h1>{{ pageTitle }}</h1>
      <p>Содержимое раздела "{{ pageTitle }}"</p>
    </div>
  `,
  styles: [`
    .placeholder-container {
      padding: 24px;
    }

    h1 {
      margin-bottom: 16px;
      font-size: 24px;
      font-weight: 400;
      color: var(--text-primary);
    }

    p {
      color: var(--text-secondary);
    }
  `]
})
export class PlaceholderComponent implements OnInit {
  pageTitle: string = 'Страница';

  private routeTitles: { [key: string]: string } = {
    '/settings/general': 'Общие настройки',
    '/settings/forecasting': 'Прогнозирование',
    '/restaurants/templates': 'Шаблоны',
    '/restaurants/receipt-templates': 'Шаблоны чеков',
    '/restaurants/commissions': 'Комиссии агрегаторов',
    '/restaurants/panels': 'Панели',
    '/restaurants/auto-add-dishes': 'Автодобавление блюд',
    '/restaurants/iikocard-networks': 'Управление сетями iikoCard',
    '/warehouse': 'Склад',
    '/analytics': 'Аналитика',
    '/notifications': 'Оповещения',
    '/staff': 'Персонал',
    '/beer-marking': 'Маркировка разливного пива',
    '/events': 'События'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const currentPath = window.location.pathname;
    this.pageTitle = this.routeTitles[currentPath] || 'Страница не найдена';
  }
}
