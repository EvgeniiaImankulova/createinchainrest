import { Injectable } from '@angular/core';

export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItems: MenuItem[] = [
    {
      label: 'Общие настройки',
      icon: 'settings',
      route: '/settings/general'
    },
    {
      label: 'Прогнозирование',
      icon: 'timeline',
      route: '/settings/forecasting'
    },
    {
      label: 'Настройки корпорации',
      icon: 'business',
      route: '/settings/corporation'
    },
    {
      label: 'Рестораны',
      icon: 'restaurant',
      children: [
        {
          label: 'Шаблоны',
          route: '/restaurants/templates'
        },
        {
          label: 'Шаблоны чеков',
          route: '/restaurants/receipt-templates'
        },
        {
          label: 'Рестораны',
          route: '/restaurants/list'
        },
        {
          label: 'Комиссии агрегаторов',
          route: '/restaurants/commissions'
        },
        {
          label: 'Панели',
          route: '/restaurants/panels'
        },
        {
          label: 'Автодобавление блюд',
          route: '/restaurants/auto-add-dishes'
        },
        {
          label: 'Управление сетями iikoCard',
          route: '/restaurants/iikocard-networks'
        }
      ]
    },
    {
      label: 'Склад',
      icon: 'warehouse',
      route: '/warehouse'
    },
    {
      label: 'Аналитика',
      icon: 'analytics',
      route: '/analytics'
    },
    {
      label: 'Оповещения',
      icon: 'notifications',
      route: '/notifications'
    },
    {
      label: 'Персонал',
      icon: 'people',
      route: '/staff'
    },
    {
      label: 'Маркировка разливного пива',
      icon: 'local_bar',
      route: '/beer-marking'
    },
    {
      label: 'События',
      icon: 'event',
      route: '/events'
    }
  ];

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }
}
