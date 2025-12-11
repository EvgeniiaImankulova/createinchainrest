import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService, Restaurant, LegalEntity } from '../../services/supabase.service';
import { Employee, getEmployeeFullName } from '../../models/employee.model';
import { EmployeeSidebarComponent } from '../../components/employee-sidebar/employee-sidebar.component';
import { SearchableSelectComponent, SelectOption } from '../../components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-restaurant-form',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeSidebarComponent, SearchableSelectComponent],
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css']
})
export class RestaurantFormComponent implements OnInit {
  isEditMode = false;
  restaurantId: string | null = null;
  isSaving = false;
  legalEntities: LegalEntity[] = [];
  employees: Employee[] = [];
  isEmployeeSidebarOpen = false;
  activeTab = 'general';

  form: Restaurant = {
    name: '',
    description: '',
    short_name: '',
    code: '',
    address: '',
    address_street: '',
    address_city: '',
    address_region: '',
    address_country: '',
    address_postal_code: '',
    address_comment: '',
    address_latitude: undefined,
    address_longitude: undefined,
    phone: '',
    email: '',
    website: '',
    timezone: '(UTC+3:00) Европа/Москва',
    template: '',
    is_franchise: false,
    is_draft: false,
    connection_status: 'disconnected',
    legal_entity_id: '',
    opening_hours: null,
    warehouse_settings: null,
    terminal_settings: null,
    external_settings: null
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.restaurantId = this.route.snapshot.paramMap.get('id');
    await this.loadLegalEntities();
    await this.loadEmployees();

    if (this.restaurantId) {
      this.isEditMode = true;
      await this.loadRestaurant();
    }
  }

  async loadLegalEntities() {
    try {
      this.legalEntities = await this.supabaseService.getLegalEntities();
    } catch (error) {
      console.error('Error loading legal entities:', error);
    }
  }

  async loadEmployees() {
    try {
      this.employees = await this.supabaseService.getEmployees();
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  async loadRestaurant() {
    try {
      const restaurant = await this.supabaseService.getRestaurant(this.restaurantId!);
      if (restaurant) {
        this.form = restaurant;
      }
    } catch (error) {
      console.error('Error loading restaurant:', error);
      alert('Ошибка загрузки данных');
    }
  }

  async saveDraft() {
    await this.save(true);
  }

  async saveRestaurant() {
    await this.save(false);
  }

  async save(isDraft: boolean) {
    if (!this.form.name?.trim()) {
      alert('Пожалуйста, введите название');
      return;
    }

    this.isSaving = true;
    this.form.is_draft = isDraft;

    try {
      if (this.isEditMode && this.restaurantId) {
        await this.supabaseService.updateRestaurant(this.restaurantId, this.form);
      } else {
        await this.supabaseService.createRestaurant(this.form);
      }

      alert(isDraft ? 'Черновик сохранен' : 'Ресторан сохранен');
      this.router.navigate(['/network-settings/restaurants']);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      alert('Ошибка сохранения');
    } finally {
      this.isSaving = false;
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  cancel() {
    this.router.navigate(['/network-settings/restaurants']);
  }

  getEmployeeFullName(employee: Employee): string {
    return getEmployeeFullName(employee);
  }

  get legalEntityOptions(): SelectOption[] {
    return this.legalEntities.map(le => ({
      value: le.id!,
      label: le.name
    }));
  }

  get ownerOptions(): SelectOption[] {
    const options: SelectOption[] = this.employees.map(emp => ({
      value: emp.id!,
      label: getEmployeeFullName(emp)
    }));
    options.push({ value: 'add_new', label: '+ Добавить нового сотрудника' });
    return options;
  }

  onOwnerSelect(value: string) {
    if (value === 'add_new') {
      this.isEmployeeSidebarOpen = true;
    } else if (value) {
      const employee = this.employees.find(e => e.id === value);
      if (employee) {
        this.form.owner_id = employee.id;
        this.form.phone = employee.phone || '';
        this.form.email = employee.email || '';
      }
    }
  }

  async onEmployeeCreated(employee: Employee) {
    await this.loadEmployees();
    this.form.owner_id = employee.id;
    this.form.phone = employee.phone || '';
    this.form.email = employee.email || '';
  }
}
