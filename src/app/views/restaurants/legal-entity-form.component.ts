import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService, LegalEntity } from '../../services/supabase.service';
import { Employee, getEmployeeFullName } from '../../models/employee.model';
import { EmployeeSidebarComponent } from '../../components/employee-sidebar/employee-sidebar.component';

@Component({
  selector: 'app-legal-entity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeSidebarComponent],
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
    } catch (error) {
      console.error('Error loading employees:', error);
    }
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

  async saveDraft() {
    await this.save(true);
  }

  async saveEntity() {
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
      if (this.isEditMode && this.entityId) {
        await this.supabaseService.updateLegalEntity(this.entityId, this.form);
      } else {
        await this.supabaseService.createLegalEntity(this.form);
      }

      alert(isDraft ? 'Черновик сохранен' : 'Юридическое лицо сохранено');
      this.router.navigate(['/network-settings/restaurants']);
    } catch (error) {
      console.error('Error saving legal entity:', error);
      alert('Ошибка сохранения');
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
