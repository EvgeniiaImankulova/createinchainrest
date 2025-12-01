import { Routes } from '@angular/router';
import { SalesComponent } from './views/forecast/sales.component';
import { ProductsComponent } from './views/forecast/products.component';
import { IngredientsComponent } from './views/forecast/ingredients.component';
import { StockComponent } from './views/warehouse/stock.component';
import { InventoryComponent } from './views/warehouse/inventory.component';
import { DocumentsComponent } from './views/warehouse/documents.component';
import { ScheduleComponent } from './views/staff/schedule.component';
import { EmployeesComponent } from './views/staff/employees.component';
import { ConstructorComponent } from './views/reports/constructor.component';
import { OverviewComponent } from './views/reports/overview.component';
import { LoyaltyComponent } from './views/reports/loyalty.component';
import { CorporationComponent } from './views/settings/corporation.component';
import { RestaurantsListComponent } from './views/restaurants/list.component';
import { LegalEntityFormComponent } from './views/restaurants/legal-entity-form.component';
import { RestaurantFormComponent } from './views/restaurants/restaurant-form.component';
import { PlaceholderComponent } from './views/placeholder/placeholder.component';

export const routes: Routes = [
  { path: '', redirectTo: '/network-settings/corporation', pathMatch: 'full' },
  { path: 'network-settings/corporation', component: CorporationComponent },
  { path: 'network-settings/restaurants', component: RestaurantsListComponent },
  { path: 'network-settings/restaurants/legal-entity/new', component: LegalEntityFormComponent },
  { path: 'network-settings/restaurants/legal-entity/:id', component: LegalEntityFormComponent },
  { path: 'network-settings/restaurants/restaurant/new', component: RestaurantFormComponent },
  { path: 'network-settings/restaurants/restaurant/:id', component: RestaurantFormComponent },
  { path: 'forecast/sales', component: SalesComponent },
  { path: 'forecast/products', component: ProductsComponent },
  { path: 'forecast/ingredients', component: IngredientsComponent },
  { path: 'warehouse/stock', component: StockComponent },
  { path: 'warehouse/inventory', component: InventoryComponent },
  { path: 'warehouse/documents', component: DocumentsComponent },
  { path: 'staff/schedule', component: ScheduleComponent },
  { path: 'staff/employees', component: EmployeesComponent },
  { path: 'reports/constructor', component: ConstructorComponent },
  { path: 'reports/overview', component: OverviewComponent },
  { path: 'reports/loyalty', component: LoyaltyComponent }
];
