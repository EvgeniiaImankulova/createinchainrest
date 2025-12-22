import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BankAccount } from '../../services/supabase.service';

@Component({
  selector: 'app-bank-accounts-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-accounts-list.component.html',
  styleUrls: ['./bank-accounts-list.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BankAccountsListComponent),
      multi: true
    }
  ]
})
export class BankAccountsListComponent implements ControlValueAccessor {
  @Input() accounts: BankAccount[] = [];
  @Output() accountsChange = new EventEmitter<BankAccount[]>();

  editingIndex: number | null = null;
  isAddingNew = false;
  newAccount: BankAccount = this.createEmptyAccount();

  private onChange: any = () => {};
  private onTouched: any = () => {};
  private initialized = false;

  writeValue(value: BankAccount[]): void {
    if (value) {
      this.accounts = value;
      if (!this.initialized && this.accounts.length === 1 && !this.accounts[0].account_number) {
        this.editingIndex = 0;
        this.initialized = true;
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  createEmptyAccount(): BankAccount {
    return {
      account_number: '',
      bik: '',
      correspondent_account: '',
      bank_name: '',
      bank_city: ''
    };
  }

  addNewAccount() {
    this.isAddingNew = true;
    this.newAccount = this.createEmptyAccount();
  }

  saveNewAccount() {
    if (this.newAccount.account_number) {
      this.accounts.push({ ...this.newAccount });
      this.accountsChange.emit(this.accounts);
      this.onChange(this.accounts);
      this.isAddingNew = false;
      this.newAccount = this.createEmptyAccount();
    }
  }

  cancelNewAccount() {
    this.isAddingNew = false;
    this.newAccount = this.createEmptyAccount();
  }

  editAccount(index: number) {
    this.editingIndex = index;
  }

  saveAccount(index: number) {
    this.editingIndex = null;
    this.accountsChange.emit(this.accounts);
    this.onChange(this.accounts);
  }

  cancelEdit() {
    this.editingIndex = null;
  }

  deleteAccount(index: number) {
    this.accounts.splice(index, 1);
    this.accountsChange.emit(this.accounts);
    this.onChange(this.accounts);
  }
}
