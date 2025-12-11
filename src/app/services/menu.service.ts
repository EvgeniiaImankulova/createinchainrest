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
      label: 'Настройки сети',
      icon: 'settings',
      children: [
        {
          label: 'Настройки корпорации',
          route: '/network-settings/corporation'
        },
        {
          label: 'Рестораны сети',
          children: [
            {
              label: 'Юридическое лицо',
              route: '/network-settings/restaurants/legal-entity'
            },
            {
              label: 'Ресторан',
              route: '/network-settings/restaurants/restaurant'
            }
          ]
        }
      ]
    },
    {
      label: 'Примеры',
      icon: 'code',
      children: [
        {
          label: 'Searchable Select',
          route: '/examples/searchable-select'
        }
      ]
    }
  ];

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }
}
