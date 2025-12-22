import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService, LegalEntity, BankAccount } from '../../services/supabase.service';
import { LegalEntityGroup } from '../../models/legal-entity-group.model';
import { Employee, getEmployeeFullName } from '../../models/employee.model';
import { SearchableSelectComponent, SelectOption } from '../../components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-legal-entity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableSelectComponent],
  templateUrl: './legal-entity-form.component.html',
  styleUrls: ['./legal-entity-form.component.css']
})
export class LegalEntityFormComponent implements OnInit {
  isEditMode = false;
  entityId: string | null = null;
  isSaving = false;
  groups: LegalEntityGroup[] = [];
  showGroupModal = false;
  isSavingGroup = false;
  employees: Employee[] = [];
  employeeOptions: SelectOption[] = [];

  bankAccount: BankAccount = {
    account_number: '',
    bik: '',
    correspondent_account: '',
    bank_name: '',
    bank_city: ''
  };

  newGroupForm: LegalEntityGroup = {
    id: '',
    name: '',
    description: ''
  };

  form: LegalEntity = {
    name: '',
    description: '',
    inn: '',
    kpp: '',
    okpo: '',
    okpd: '',
    ogrn: '',
    legal_address_street: '',
    legal_address_city: '',
    legal_address_region: '',
    legal_address_country: '',
    legal_address_postal_code: '',
    phone: '',
    director_id: undefined,
    accountant_id: undefined,
    technologist_id: undefined,
    production_manager_id: undefined,
    is_franchise: false,
    royalty_percent: undefined,
    is_draft: false
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.entityId = this.route.snapshot.paramMap.get('id');
    await Promise.all([
      this.loadGroups(),
      this.loadEmployees()
    ]);

    if (this.entityId) {
      this.isEditMode = true;
      await this.loadEntity();
    }
  }

  async loadGroups() {
    try {
      this.groups = await this.supabaseService.getLegalEntityGroups();
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  }

  async loadEmployees() {
    try {
      this.employees = await this.supabaseService.getEmployees();
      this.employeeOptions = this.employees.map(emp => ({
        value: emp.id!,
        label: getEmployeeFullName(emp),
        subtitle: emp.position || undefined
      }));
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  async loadEntity() {
    try {
      const entity = await this.supabaseService.getLegalEntity(this.entityId!);
      if (entity) {
        this.form = entity;
        const bankAccounts = await this.supabaseService.getBankAccounts(this.entityId!);
        if (bankAccounts.length > 0) {
          this.bankAccount = bankAccounts[0];
        }
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
      this.bankAccount.account_number?.trim()
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
    if (!this.bankAccount.account_number?.trim()) {
      missing.push('Расчетный счет');
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

  async saveEntity() {
    if (!this.isFormValid) {
      const missing = this.missingRequiredFields;
      alert(`Пожалуйста, заполните все обязательные поля:\n\n${missing.map(f => `• ${f}`).join('\n')}`);
      return;
    }

    this.isSaving = true;
    this.form.is_draft = false;

    try {
      let entityId: string;
      if (this.isEditMode && this.entityId) {
        await this.supabaseService.updateLegalEntity(this.entityId, this.form);
        entityId = this.entityId;
      } else {
        const newEntity = await this.supabaseService.createLegalEntity(this.form);
        entityId = newEntity.id!;
      }

      await this.saveBankAccounts(entityId);

      alert('Юридическое лицо сохранено');
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
    this.bankAccount.legal_entity_id = legalEntityId;

    if (this.bankAccount.id) {
      await this.supabaseService.updateBankAccount(this.bankAccount.id, this.bankAccount);
    } else {
      await this.supabaseService.createBankAccount(this.bankAccount);
    }
  }

  openCreateGroupModal() {
    this.newGroupForm = {
      id: '',
      name: '',
      description: ''
    };
    this.showGroupModal = true;
  }

  closeGroupModal() {
    this.showGroupModal = false;
  }

  async saveNewGroup() {
    if (!this.newGroupForm.name.trim()) {
      return;
    }

    this.isSavingGroup = true;
    try {
      const newGroup = await this.supabaseService.createLegalEntityGroup({
        name: this.newGroupForm.name,
        description: this.newGroupForm.description || ''
      });
      this.groups.push(newGroup);
      this.form.group_id = newGroup.id;
      this.closeGroupModal();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Ошибка создания группы');
    } finally {
      this.isSavingGroup = false;
    }
  }

  cancel() {
    this.router.navigate(['/network-settings/restaurants']);
  }
}
