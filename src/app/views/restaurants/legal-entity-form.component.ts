import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService, LegalEntity } from '../../services/supabase.service';
import { Employee, getEmployeeFullName } from '../../models/employee.model';
import { EmployeeSidebarComponent } from '../../components/employee-sidebar/employee-sidebar.component';
import { SearchableSelectComponent, SelectOption } from '../../components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-legal-entity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeSidebarComponent, SearchableSelectComponent],
  templateUrl: './legal-entity-form.component.html',
  styleUrls: ['./legal-entity-form.component.css']
})
export class LegalEntityFormComponent implements OnInit {
  isEditMode = false;
  entityId: string | null = null;
  isSaving = false;
  employees: Employee[] = [];
  isEmployeeSidebarOpen = false;
  currentEmployeeField: 'director' | 'accountant' | null = null;

  form: LegalEntity = {
    name: '',
    legal_name: '',
    inn: '',
    kpp: '',
    ogrn: '',
    legal_address: '',
    legal_address_street: '',
    legal_address_city: '',
    legal_address_region: '',
    legal_address_country: '',
    legal_address_postal_code: '',
    legal_address_comment: '',
    legal_address_latitude: undefined,
    legal_address_longitude: undefined,
    actual_address: '',
    actual_address_street: '',
    actual_address_city: '',
    actual_address_region: '',
    actual_address_country: '',
    actual_address_postal_code: '',
    actual_address_comment: '',
    actual_address_latitude: undefined,
    actual_address_longitude: undefined,
    phone: '',
    email: '',
    director: '',
    accountant: '',
    bank_name: '',
    bik: '',
    correspondent_account: '',
    payment_account: '',
    is_draft: false
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.entityId = this.route.snapshot.paramMap.get('id');
    await this.loadEmployees();

    if (this.entityId) {
      this.isEditMode = true;
      await this.loadEntity();
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

  get employeeOptions(): SelectOption[] {
    const options: SelectOption[] = this.employees.map(emp => ({
      value: emp.id!,
      label: getEmployeeFullName(emp)
    }));
    options.unshift({ value: 'add_new', label: '+ Добавить нового сотрудника' });
    return options;
  }

  async loadEntity() {
    try {
      const entity = await this.supabaseService.getLegalEntity(this.entityId!);
      if (entity) {
        this.form = entity;
      }
    } catch (error) {
      console.error('Error loading legal entity:', error);
      alert('Ошибка загрузки данных');
    }
  }

  get isFormValid(): boolean {
    return !!(
      this.form.name?.trim() &&
      this.form.legal_address_street?.trim() &&
      this.form.legal_address_city?.trim() &&
      this.form.legal_address_region?.trim() &&
      this.form.legal_address_country?.trim() &&
      this.form.legal_address_latitude !== undefined &&
      this.form.legal_address_latitude !== null &&
      this.form.legal_address_longitude !== undefined &&
      this.form.legal_address_longitude !== null &&
      this.form.actual_address_street?.trim() &&
      this.form.actual_address_city?.trim() &&
      this.form.actual_address_region?.trim() &&
      this.form.actual_address_country?.trim() &&
      this.form.actual_address_latitude !== undefined &&
      this.form.actual_address_latitude !== null &&
      this.form.actual_address_longitude !== undefined &&
      this.form.actual_address_longitude !== null
    );
  }

  get missingRequiredFields(): string[] {
    const missing: string[] = [];

    if (!this.form.name?.trim()) {
      missing.push('Название');
    }
    if (!this.form.legal_address_street?.trim()) {
      missing.push('Юридический адрес: Улица и дом');
    }
    if (!this.form.legal_address_city?.trim()) {
      missing.push('Юридический адрес: Город');
    }
    if (!this.form.legal_address_region?.trim()) {
      missing.push('Юридический адрес: Регион');
    }
    if (!this.form.legal_address_country?.trim()) {
      missing.push('Юридический адрес: Страна');
    }
    if (this.form.legal_address_latitude === undefined || this.form.legal_address_latitude === null) {
      missing.push('Юридический адрес: Широта');
    }
    if (this.form.legal_address_longitude === undefined || this.form.legal_address_longitude === null) {
      missing.push('Юридический адрес: Долгота');
    }
    if (!this.form.actual_address_street?.trim()) {
      missing.push('Фактический адрес: Улица и дом');
    }
    if (!this.form.actual_address_city?.trim()) {
      missing.push('Фактический адрес: Город');
    }
    if (!this.form.actual_address_region?.trim()) {
      missing.push('Фактический адрес: Регион');
    }
    if (!this.form.actual_address_country?.trim()) {
      missing.push('Фактический адрес: Страна');
    }
    if (this.form.actual_address_latitude === undefined || this.form.actual_address_latitude === null) {
      missing.push('Фактический адрес: Широта');
    }
    if (this.form.actual_address_longitude === undefined || this.form.actual_address_longitude === null) {
      missing.push('Фактический адрес: Долгота');
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

  async saveEntity() {
    if (!this.isFormValid) {
      const missing = this.missingRequiredFields;
      alert(`Пожалуйста, заполните все обязательные поля:\n\n${missing.map(f => `• ${f}`).join('\n')}`);
      return;
    }
    await this.save(false);
  }

  async save(isDraft: boolean) {
    this.isSaving = true;
    this.form.is_draft = isDraft;

    try {
      if (this.isEditMode && this.entityId) {
        await this.supabaseService.updateLegalEntity(this.entityId, this.form);
      } else {
        await this.supabaseService.createLegalEntity(this.form);
      }

      alert(isDraft ? 'Черновик сохранен' : 'Юридическое лицо сохранено');
      this.router.navigate(['/network-settings/restaurants']);
    } catch (error: any) {
      console.error('Error saving legal entity:', error);
      const errorMessage = error?.message || 'Неизвестная ошибка';
      alert(`Ошибка сохранения:\n${errorMessage}\n\nПроверьте правильность заполнения полей`);
    } finally {
      this.isSaving = false;
    }
  }

  cancel() {
    this.router.navigate(['/network-settings/restaurants']);
  }

  getEmployeeFullName(employee: Employee): string {
    return getEmployeeFullName(employee);
  }

  onDirectorSelect(value: string) {
    this.onEmployeeSelect('director', value);
  }

  onAccountantSelect(value: string) {
    this.onEmployeeSelect('accountant', value);
  }

  onEmployeeSelect(field: 'director' | 'accountant', value: string) {
    if (value === 'add_new') {
      this.currentEmployeeField = field;
      this.isEmployeeSidebarOpen = true;
    } else if (value) {
      const employee = this.employees.find(e => e.id === value);
      if (employee) {
        if (field === 'director') {
          this.form.director_id = employee.id;
          this.form.director = `${employee.first_name} ${employee.last_name}`;
        } else {
          this.form.accountant_id = employee.id;
          this.form.accountant = `${employee.first_name} ${employee.last_name}`;
        }
        this.form.phone = employee.phone || '';
        this.form.email = employee.email || '';
      }
    }
  }

  async onEmployeeCreated(employee: Employee) {
    await this.loadEmployees();

    if (this.currentEmployeeField === 'director') {
      this.form.director_id = employee.id;
      this.form.director = `${employee.first_name} ${employee.last_name}`;
    } else if (this.currentEmployeeField === 'accountant') {
      this.form.accountant_id = employee.id;
      this.form.accountant = `${employee.first_name} ${employee.last_name}`;
    }

    this.form.phone = employee.phone || '';
    this.form.email = employee.email || '';
    this.currentEmployeeField = null;
  }
}
