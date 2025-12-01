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
          route: '/settings/corporation'
        },
        {
          label: 'Рестораны сети',
          route: '/restaurants/list'
        }
      ]
    }
  ];

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }
}
