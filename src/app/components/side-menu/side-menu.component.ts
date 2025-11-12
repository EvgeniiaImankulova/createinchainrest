import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { MenuItem } from '../../models/menu-item.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  expandedMenus: Set<string> = new Set();
  activeRoute: string = '';

  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {
    this.menuItems = this.navigationService.getMenuItems();
  }

  ngOnInit(): void {
    this.activeRoute = this.router.url;
    this.navigationService.expandMenuForRoute(this.activeRoute);

    this.navigationService.expandedMenus$.subscribe(expanded => {
      this.expandedMenus = expanded;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.url;
      });
  }

  toggleMenu(menuId: string): void {
    this.navigationService.toggleMenu(menuId);
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  }

  isActiveRoute(route: string): boolean {
    return this.activeRoute === route;
  }

  isActiveParent(item: MenuItem): boolean {
    return item.submenu?.some(sub => sub.route === this.activeRoute) || false;
  }

  hasSubmenu(item: MenuItem): boolean {
    return !!item.submenu && item.submenu.length > 0;
  }

  onMenuItemClick(item: MenuItem): void {
    if (this.hasSubmenu(item)) {
      this.toggleMenu(item.id);
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  onSubmenuItemClick(route: string): void {
    this.router.navigate([route]);
  }
}
