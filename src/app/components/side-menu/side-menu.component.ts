import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MenuService, MenuItem } from '../../services/menu.service';
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
  expandedItems: Set<string> = new Set();
  activeParentLabel: string = '';

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {
    this.menuItems = this.menuService.getMenuItems();
  }

  ngOnInit(): void {
    this.updateActiveParent(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveParent(event.url);
      });
  }

  private updateActiveParent(url: string): void {
    for (const item of this.menuItems) {
      if (item.children) {
        const hasActiveChild = item.children.some(child => child.route === url);
        if (hasActiveChild) {
          this.activeParentLabel = item.label;
          this.expandedItems.add(item.label);
          return;
        }
      }
    }
  }

  toggleExpanded(label: string): void {
    if (this.expandedItems.has(label)) {
      this.expandedItems.delete(label);
    } else {
      this.expandedItems.add(label);
    }
  }

  isExpanded(label: string): boolean {
    return this.expandedItems.has(label);
  }

  isActiveParent(label: string): boolean {
    return this.activeParentLabel === label;
  }

  isDivider(item: MenuItem): boolean {
    return item.label === 'divider';
  }
}
