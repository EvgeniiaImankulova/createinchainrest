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
  activeTab: 'basic' | 'network' = 'basic';

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


  currencies = [
    { value: 'RUB', label: '₽ Российский рубль' },
    { value: 'USD', label: '$ Доллар США' },
    { value: 'EUR', label: '€ Евро' }
  ];

  switchTab(tab: 'basic' | 'network'): void {
    this.activeTab = tab;
  }

  onSave(): void {
    console.log('Сохранение настроек корпорации:', this.corporationSettings);
  }
}
