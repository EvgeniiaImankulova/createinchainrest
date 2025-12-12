import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchableSelectComponent, SelectOption } from '../../components/searchable-select/searchable-select.component';
import { SupabaseService } from '../../services/supabase.service';
import { Employee, getEmployeeFullName } from '../../models/employee.model';
import { EmployeeSidebarComponent } from '../../components/employee-sidebar/employee-sidebar.component';

@Component({
  selector: 'app-corporation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchableSelectComponent,
    EmployeeSidebarComponent
  ],
  templateUrl: './corporation.component.html',
  styleUrl: './corporation.component.css'
})
export class CorporationComponent implements OnInit {
  activeTab: 'basic' | 'network' = 'basic';
  employees: Employee[] = [];
  isEmployeeSidebarOpen = false;

  corporationSettings = {
    name: '',
    description: '',
    uid: '123-123-123',
    director_id: '',
    directorName: '',
    phone: '',
    email: '',
    addressStreet: '',
    addressCity: '',
    addressRegion: '',
    addressCountry: '',
    addressPostalCode: '',
    addressComment: '',
    addressLatitude: undefined as number | undefined,
    addressLongitude: undefined as number | undefined,
    inn: '',
    kpp: '',
    ogrn: '',
    isFranchiseNetwork: false,
    defaultRoyalty: 0,
    currency: 'RUB'
  };

  currencies: SelectOption[] = [
    { value: 'RUB', label: '₽ Российский рубль' },
    { value: 'USD', label: '$ Доллар США' },
    { value: 'EUR', label: '€ Евро' }
  ];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadEmployees();
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

  get directorOptions(): SelectOption[] {
    const options: SelectOption[] = this.employees.map(emp => ({
      value: emp.id!,
      label: getEmployeeFullName(emp)
    }));
    options.unshift({ value: 'add_new', label: '+ Добавить нового сотрудника' });
    return options;
  }

  onDirectorSelect(value: string) {
    if (value === 'add_new') {
      this.isEmployeeSidebarOpen = true;
    } else if (value) {
      const employee = this.employees.find(e => e.id === value);
      if (employee) {
        this.corporationSettings.director_id = employee.id!;
        this.corporationSettings.directorName = getEmployeeFullName(employee);
      }
    }
  }

  async onEmployeeCreated(employee: Employee) {
    await this.loadEmployees();
    this.corporationSettings.director_id = employee.id!;
    this.corporationSettings.directorName = getEmployeeFullName(employee);
  }

  switchTab(tab: 'basic' | 'network'): void {
    this.activeTab = tab;
  }

  onSave(): void {
    console.log('Сохранение настроек корпорации:', this.corporationSettings);
  }
}
