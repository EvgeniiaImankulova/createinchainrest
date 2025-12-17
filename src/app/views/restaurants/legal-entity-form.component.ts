import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService, LegalEntity, BankAccount } from '../../services/supabase.service';
import { BankAccountsListComponent } from '../../components/bank-accounts-list/bank-accounts-list.component';

@Component({
  selector: 'app-legal-entity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, BankAccountsListComponent],
  templateUrl: './legal-entity-form.component.html',
  styleUrls: ['./legal-entity-form.component.css']
})
export class LegalEntityFormComponent implements OnInit {
  isEditMode = false;
  entityId: string | null = null;
  isSaving = false;
  bankAccounts: BankAccount[] = [];

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
    director_name: '',
    accountant_name: '',
    technologist_name: '',
    production_manager_name: '',
    is_draft: false
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.entityId = this.route.snapshot.paramMap.get('id');

    if (this.entityId) {
      this.isEditMode = true;
      await this.loadEntity();
    }
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
}
