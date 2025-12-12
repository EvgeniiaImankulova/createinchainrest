import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService, LegalEntity, BankAccount } from '../../services/supabase.service';
import { Employee, getEmployeeFullName } from '../../models/employee.model';
import { EmployeeSidebarComponent } from '../../components/employee-sidebar/employee-sidebar.component';
import { SearchableSelectComponent, SelectOption } from '../../components/searchable-select/searchable-select.component';
import { BankAccountsListComponent } from '../../components/bank-accounts-list/bank-accounts-list.component';

@Component({
  selector: 'app-legal-entity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeSidebarComponent, SearchableSelectComponent, BankAccountsListComponent],
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
  bankAccounts: BankAccount[] = [];

  form: LegalEntity = {
    name: '',
    description: '',
    inn: '',
    kpp: '',
    okpo: '',
    ogrn: '',
    registration_number: '',
    legal_address_street: '',
    legal_address_city: '',
    legal_address_region: '',
    legal_address_country: '',
    legal_address_postal_code: '',
    phone: '',
    email: '',
    director_id: undefined,
    director_phone: '',
    director_email: '',
    accountant_id: undefined,
    accountant_phone: '',
    accountant_email: '',
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
        this.bankAccounts = await this.supabaseService.getBankAccounts(this.entityId!);
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
      this.form.legal_address_country?.trim()
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

  private sanitizeFormData(data: LegalEntity): LegalEntity {
    const sanitized = { ...data };

    if (!sanitized.director_id || sanitized.director_id === '') {
      sanitized.director_id = undefined;
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

      let entityId: string;
      if (this.isEditMode && this.entityId) {
        await this.supabaseService.updateLegalEntity(this.entityId, sanitizedData);
        entityId = this.entityId;
      } else {
        const newEntity = await this.supabaseService.createLegalEntity(sanitizedData);
        entityId = newEntity.id!;
      }

      await this.saveBankAccounts(entityId);

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

  async saveBankAccounts(legalEntityId: string) {
    const existingAccounts = this.isEditMode ? await this.supabaseService.getBankAccounts(legalEntityId) : [];
    const existingIds = existingAccounts.map(a => a.id);

    for (const account of this.bankAccounts) {
      account.legal_entity_id = legalEntityId;

      if (account.id && existingIds.includes(account.id)) {
        await this.supabaseService.updateBankAccount(account.id, account);
      } else {
        await this.supabaseService.createBankAccount(account);
      }
    }

    const currentIds = this.bankAccounts.filter(a => a.id).map(a => a.id);
    const accountsToDelete = existingAccounts.filter(a => !currentIds.includes(a.id));
    for (const account of accountsToDelete) {
      if (account.id) {
        await this.supabaseService.deleteBankAccount(account.id);
      }
    }
  }

  onBankAccountsChange(accounts: BankAccount[]) {
    this.bankAccounts = accounts;
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
          this.form.director_phone = employee.phone || '';
          this.form.director_email = employee.email || '';
        } else {
          this.form.accountant_id = employee.id;
          this.form.accountant_phone = employee.phone || '';
          this.form.accountant_email = employee.email || '';
        }
      }
    }
  }

  async onEmployeeCreated(employee: Employee) {
    await this.loadEmployees();

    if (this.currentEmployeeField === 'director') {
      this.form.director_id = employee.id;
      this.form.director_phone = employee.phone || '';
      this.form.director_email = employee.email || '';
    } else if (this.currentEmployeeField === 'accountant') {
      this.form.accountant_id = employee.id;
      this.form.accountant_phone = employee.phone || '';
      this.form.accountant_email = employee.email || '';
    }

    this.currentEmployeeField = null;
  }
}
