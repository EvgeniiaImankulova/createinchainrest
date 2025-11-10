import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageUploaderComponent } from '../../components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-corporation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ImageUploaderComponent
  ],
  templateUrl: './corporation.component.html',
  styleUrl: './corporation.component.css'
})
export class CorporationComponent {
  corporationSettings = {
    name: '',
    description: '',
    uid: '',
    directorName: '',
    phone: '',
    email: '',
    address: '',
    inn: '',
    kpp: '',
    franchiseNetwork: '',
    defaultRoyalty: '',
    currency: 'RUB',
    roundingEnabled: false,
    logo: null as File | null,
    backgroundImage: null as File | null
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

  onLogoChange(file: File | null): void {
    this.corporationSettings.logo = file;
    if (file) {
      console.log('Выбран логотип:', file.name);
    }
  }

  onBackgroundChange(file: File | null): void {
    this.corporationSettings.backgroundImage = file;
    if (file) {
      console.log('Выбран фоновый рисунок:', file.name);
    }
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
