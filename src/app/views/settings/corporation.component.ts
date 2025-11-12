import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-corporation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './corporation.component.html',
  styleUrl: './corporation.component.css'
})
export class CorporationComponent {
  corporationSettings = {
    name: '',
    description: '',
    uid: '123-123-123',
    directorName: '',
    phone: '',
    email: '',
    address: '',
    inn: '',
    kpp: '',
    ogrn: '',
    isFranchiseNetwork: false,
    defaultRoyalty: 0,
    currency: 'RUB'
  };

  preparationPlaces: string[] = [
    '01 Бар',
    '01 Кухня',
    '01 Горячий цех',
    '02 Бар'
  ];

  courses: { number: number; name: string }[] = [
    { number: 0, name: 'VIP' },
    { number: 1, name: 'Курс 1' },
    { number: 2, name: 'Курс 2' },
    { number: 3, name: 'Курс 3' }
  ];

  currencies = [
    { value: 'RUB', label: '₽ Российский рубль' },
    { value: 'USD', label: '$ Доллар США' },
    { value: 'EUR', label: '€ Евро' }
  ];

  onSave(): void {
    console.log('Сохранение настроек корпорации:', this.corporationSettings);
  }

  addPreparationPlace(): void {
    this.preparationPlaces.push('');
  }

  removePreparationPlace(index: number): void {
    this.preparationPlaces.splice(index, 1);
  }

  addCourse(): void {
    const nextNumber = this.courses.length > 0
      ? Math.max(...this.courses.map(c => c.number)) + 1
      : 0;
    this.courses.push({ number: nextNumber, name: '' });
  }

  removeCourse(index: number): void {
    this.courses.splice(index, 1);
  }
}
