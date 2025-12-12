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

  defaultRoyaltyPercent = 5;

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
    owner_id: '',
    owner_phone: '',
    owner_email: '',
    accountant_id: '',
    accountant_phone: '',
    accountant_email: '',
    royalty_percent: 0,
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

      if (this.employees.length === 0) {
        this.employees = [
          {
            id: 'mock-1',
            first_name: 'Иван',
            last_name: 'Петров',
            system_name: 'i.petrov',
            phone: '+7 (999) 123-45-67',
            email: 'i.petrov@example.com'
          },
          {
            id: 'mock-2',
            first_name: 'Мария',
            last_name: 'Иванова',
            system_name: 'm.ivanova',
            phone: '+7 (999) 234-56-78',
            email: 'm.ivanova@example.com'
          },
          {
            id: 'mock-3',
            first_name: 'Алексей',
            last_name: 'Смирнов',
            system_name: 'a.smirnov',
            phone: '+7 (999) 345-67-89',
            email: 'a.smirnov@example.com'
          },
          {
            id: 'mock-4',
            first_name: 'Ольга',
            last_name: 'Кузнецова',
            system_name: 'o.kuznetsova',
            phone: '+7 (999) 456-78-90',
            email: 'o.kuznetsova@example.com'
          },
          {
            id: 'mock-5',
            first_name: 'Дмитрий',
            last_name: 'Соколов',
            system_name: 'd.sokolov',
            phone: '+7 (999) 567-89-01',
            email: 'd.sokolov@example.com'
          }
        ];
      }
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

  get templateOptions(): SelectOption[] {
    return [
      { value: 'WEB-11353-без-дневных-интеров', label: 'WEB-11353-без-дневных-интеров' },
      { value: 'Default', label: 'Default' },
      { value: 'Restaurant-Full', label: 'Restaurant-Full' },
      { value: 'Cafe-Standard', label: 'Cafe-Standard' }
    ];
  }

  get ownerOptions(): SelectOption[] {
    const options: SelectOption[] = this.employees.map(emp => ({
      value: emp.id!,
      label: getEmployeeFullName(emp)
    }));
    options.unshift({ value: 'add_new', label: '+ Добавить нового сотрудника' });
    return options;
  }

  get accountantOptions(): SelectOption[] {
    const options: SelectOption[] = this.employees.map(emp => ({
      value: emp.id!,
      label: getEmployeeFullName(emp)
    }));
    options.unshift({ value: 'add_new', label: '+ Добавить нового сотрудника' });
    return options;
  }

  onFranchiseChange() {
    if (this.form.is_franchise && !this.form.royalty_percent) {
      this.form.royalty_percent = this.defaultRoyaltyPercent;
    }
  }

  onOwnerSelect(value: string) {
    if (value === 'add_new') {
      this.isEmployeeSidebarOpen = true;
    } else if (value) {
      const employee = this.employees.find(e => e.id === value);
      if (employee) {
        this.form.owner_id = employee.id;
        this.form.owner_phone = employee.phone || '';
        this.form.owner_email = employee.email || '';
      }
    }
  }

  onAccountantSelect(value: string) {
    if (value === 'add_new') {
      this.isEmployeeSidebarOpen = true;
    } else if (value) {
      const employee = this.employees.find(e => e.id === value);
      if (employee) {
        this.form.accountant_id = employee.id;
        this.form.accountant_phone = employee.phone || '';
        this.form.accountant_email = employee.email || '';
      }
    }
  }

  async onEmployeeCreated(employee: Employee) {
    await this.loadEmployees();
    this.form.owner_id = employee.id;
    this.form.owner_phone = employee.phone || '';
    this.form.owner_email = employee.email || '';
  }
}
