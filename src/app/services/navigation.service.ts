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
      id: 'general-settings',
      label: 'Общие настройки',
      icon: 'settings',
      route: '/settings/general'
    },
    {
      id: 'forecasting',
      label: 'Прогнозирование',
      icon: 'timeline',
      route: '/settings/forecasting'
    },
    {
      id: 'corporation',
      label: 'Настройки корпорации',
      icon: 'business',
      route: '/settings/corporation'
    },
    {
      id: 'restaurants',
      label: 'Рестораны',
      icon: 'restaurant',
      submenu: [
        { id: 'templates', label: 'Шаблоны', route: '/restaurants/templates' },
        { id: 'receipt-templates', label: 'Шаблоны чеков', route: '/restaurants/receipt-templates' },
        { id: 'list', label: 'Рестораны', route: '/restaurants/list' },
        { id: 'commissions', label: 'Комиссии агрегаторов', route: '/restaurants/commissions' },
        { id: 'panels', label: 'Панели', route: '/restaurants/panels' },
        { id: 'auto-add-dishes', label: 'Автодобавление блюд', route: '/restaurants/auto-add-dishes' },
        { id: 'iikocard-networks', label: 'Управление сетями iikoCard', route: '/restaurants/iikocard-networks' }
      ]
    },
    {
      id: 'warehouse',
      label: 'Склад',
      icon: 'warehouse',
      route: '/warehouse'
    },
    {
      id: 'analytics',
      label: 'Аналитика',
      icon: 'analytics',
      route: '/analytics'
    },
    {
      id: 'notifications',
      label: 'Оповещения',
      icon: 'notifications',
      route: '/notifications'
    },
    {
      id: 'staff',
      label: 'Персонал',
      icon: 'people',
      route: '/staff'
    },
    {
      id: 'beer-marking',
      label: 'Маркировка разливного пива',
      icon: 'local_bar',
      route: '/beer-marking'
    },
    {
      id: 'events',
      label: 'События',
      icon: 'event',
      route: '/events'
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
    const menuItem = this.menuItems.find(item =>
      item.submenu?.some(sub => sub.route === route)
    );

    if (menuItem) {
      const expanded = new Set<string>();
      expanded.add(menuItem.id);
      this.expandedMenus.next(expanded);
    }
  }
}
