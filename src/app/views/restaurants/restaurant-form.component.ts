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
    legal_entity_id: undefined,
    owner_id: undefined,
    owner_phone: '',
    owner_email: '',
    accountant_id: undefined,
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

      if (this.legalEntities.length === 0) {
        this.legalEntities = [
          {
            id: 'mock-le-1',
            name: 'ООО "Вкусная еда"',
            inn: '7707123456',
            kpp: '770701001',
            ogrn: '1234567890123'
          },
          {
            id: 'mock-le-2',
            name: 'ООО "Ресторанный холдинг"',
            inn: '7707654321',
            kpp: '770701002',
            ogrn: '3210987654321'
          },
          {
            id: 'mock-le-3',
            name: 'ИП Иванов И.И.',
            inn: '770712345678',
            ogrn: '312770712345678'
          }
        ];
      }
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

  get isFormValid(): boolean {
    return !!(
      this.form.name?.trim() &&
      this.form.address_street?.trim() &&
      this.form.address_city?.trim() &&
      this.form.address_region?.trim() &&
      this.form.address_country?.trim() &&
      this.form.address_latitude !== undefined &&
      this.form.address_latitude !== null &&
      this.form.address_longitude !== undefined &&
      this.form.address_longitude !== null
    );
  }

  get missingRequiredFields(): string[] {
    const missing: string[] = [];

    if (!this.form.name?.trim()) {
      missing.push('Название');
    }
    if (!this.form.address_street?.trim()) {
      missing.push('Улица и дом');
    }
    if (!this.form.address_city?.trim()) {
      missing.push('Город');
    }
    if (!this.form.address_region?.trim()) {
      missing.push('Регион');
    }
    if (!this.form.address_country?.trim()) {
      missing.push('Страна');
    }
    if (this.form.address_latitude === undefined || this.form.address_latitude === null) {
      missing.push('Широта');
    }
    if (this.form.address_longitude === undefined || this.form.address_longitude === null) {
      missing.push('Долгота');
    }

    return missing;
  }

  get validationTooltip(): string {
    const missing = this.missingRequiredFields;
    if (missing.length === 0) {
      return '';
    }
    return `Необходимо заполнить:\n${missing.map(f => `• ${f}`).join('\n')}`;
  }

  async saveDraft() {
    await this.save(true);
  }

  async saveRestaurant() {
    if (!this.isFormValid) {
      const missing = this.missingRequiredFields;
      alert(`Пожалуйста, заполните все обязательные поля:\n\n${missing.map(f => `• ${f}`).join('\n')}`);
      return;
    }
    await this.save(false);
  }

  private sanitizeFormData(data: Restaurant): Restaurant {
    const sanitized = { ...data };

    if (!sanitized.legal_entity_id || sanitized.legal_entity_id === '') {
      sanitized.legal_entity_id = undefined;
    }
    if (!sanitized.owner_id || sanitized.owner_id === '') {
      sanitized.owner_id = undefined;
    }
    if (!sanitized.accountant_id || sanitized.accountant_id === '') {
      sanitized.accountant_id = undefined;
    }

    return sanitized;
  }

  async save(isDraft: boolean) {
    this.isSaving = true;
    this.form.is_draft = isDraft;

    try {
      const sanitizedData = this.sanitizeFormData(this.form);

      if (this.isEditMode && this.restaurantId) {
        await this.supabaseService.updateRestaurant(this.restaurantId, sanitizedData);
      } else {
        await this.supabaseService.createRestaurant(sanitizedData);
      }

      alert(isDraft ? 'Черновик сохранен' : 'Ресторан сохранен');
      this.router.navigate(['/network-settings/restaurants']);
    } catch (error: any) {
      console.error('Error saving restaurant:', error);
      const errorMessage = error?.message || 'Неизвестная ошибка';
      alert(`Ошибка сохранения:\n${errorMessage}\n\nПроверьте правильность заполнения полей`);
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

  onLegalEntitySelect(legalEntityId: string) {
    const legalEntity = this.legalEntities.find(le => le.id === legalEntityId);
    if (legalEntity) {
      if (legalEntity.is_franchise) {
        this.form.is_franchise = true;
        this.form.royalty_percent = legalEntity.royalty_percent || this.defaultRoyaltyPercent;
      }
    }
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
