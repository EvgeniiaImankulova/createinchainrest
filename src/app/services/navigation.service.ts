import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private expandedMenus = new BehaviorSubject<Set<string>>(new Set());

  expandedMenus$: Observable<Set<string>> = this.expandedMenus.asObservable();

  private menuItems: MenuItem[] = [
    {
      id: 'network-settings',
      label: 'Настройки сети',
      icon: 'assessment',
      submenu: [
        { id: 'corporation', label: 'Настройки корпорации', route: '/network-settings/corporation' },
        { id: 'restaurants-network', label: 'Рестораны сети', route: '/network-settings/restaurants' }
      ]
    }
  ];

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  toggleMenu(menuId: string): void {
    const expanded = new Set(this.expandedMenus.value);

    if (expanded.has(menuId)) {
      expanded.delete(menuId);
    } else {
      expanded.clear();
      expanded.add(menuId);
    }

    this.expandedMenus.next(expanded);
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus.value.has(menuId);
  }

  expandMenuForRoute(route: string): void {
    const expanded = new Set<string>();

    for (const menuItem of this.menuItems) {
      if (menuItem.submenu) {
        for (const subItem of menuItem.submenu) {
          if (subItem.route === route) {
            expanded.add(menuItem.id);
            this.expandedMenus.next(expanded);
            return;
          }

          if (subItem.submenu) {
            for (const nestedItem of subItem.submenu) {
              if (nestedItem.route === route) {
                expanded.add(menuItem.id);
                expanded.add(subItem.id);
                this.expandedMenus.next(expanded);
                return;
              }
            }
          }
        }
      }
    }
  }
}
