import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchableSelectComponent, SelectOption } from '../../components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-corporation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchableSelectComponent
  ],
  templateUrl: './corporation.component.html',
  styleUrl: './corporation.component.css'
})
export class CorporationComponent implements OnInit {
  activeTab: 'basic' | 'network' | 'franchise' = 'basic';

  corporationSettings = {
    name: '',
    description: '',
    uid: '123-123-123',
    trustedPhone: '',
    additionalPhone: '',
    trustedEmail: '',
    additionalEmail: '',
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

  ngOnInit() {
  }

  switchTab(tab: 'basic' | 'network' | 'franchise'): void {
    this.activeTab = tab;
  }

  onSave(): void {
    console.log('Сохранение настроек корпорации:', this.corporationSettings);
  }
}
