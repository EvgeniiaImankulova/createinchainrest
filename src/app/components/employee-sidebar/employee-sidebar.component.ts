import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, createEmptyEmployee } from '../../models/employee.model';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-employee-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-sidebar.component.html',
  styleUrls: ['./employee-sidebar.component.css']
})
export class EmployeeSidebarComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() employeeCreated = new EventEmitter<Employee>();

  form: Employee = createEmptyEmployee();
  isSaving = false;

  constructor(private supabaseService: SupabaseService) {}

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.form = createEmptyEmployee();
  }

  async save() {
    if (!this.form.first_name?.trim() || !this.form.last_name?.trim()) {
      alert('Пожалуйста, заполните имя и фамилию');
      return;
    }

    this.isSaving = true;

    try {
      const employee = await this.supabaseService.createEmployee(this.form);
      this.employeeCreated.emit(employee);
      alert('Сотрудник создан.\nОстальные данные о сотруднике можно дополнить в:\nЕжедневные операции в ресторане → Персонал → Управление сотрудниками');
      this.close();
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Ошибка создания сотрудника');
    } finally {
      this.isSaving = false;
    }
  }

  formatPhone(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 0) {
      if (value.length <= 1) {
        value = '+7 (' + value;
      } else if (value.length <= 4) {
        value = '+7 (' + value.substring(1);
      } else if (value.length <= 7) {
        value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4);
      } else if (value.length <= 9) {
        value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7);
      } else {
        value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
      }
    }

    this.form.phone = value;
  }
}
