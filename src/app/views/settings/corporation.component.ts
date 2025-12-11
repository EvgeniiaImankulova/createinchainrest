import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RestoCustomAutocompleteComponent } from '../../components/resto-custom-autocomplete/resto-custom-autocomplete.component';

@Component({
  selector: 'app-corporation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RestoCustomAutocompleteComponent
  ],
  templateUrl: './corporation.component.html',
  styleUrl: './corporation.component.css'
})
export class CorporationComponent implements OnInit {
  activeTab: 'basic' | 'network' = 'basic';

  corporationSettings = {
    name: '',
    description: '',
    uid: '123-123-123',
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

  currencies = [
    { value: 'RUB', label: '₽ Российский рубль' },
    { value: 'USD', label: '$ Доллар США' },
    { value: 'EUR', label: '€ Евро' }
  ];

  currencyControl = new FormControl('RUB');
  trackFieldName = 'value';
  trackFieldDisplayName = 'label';

  ngOnInit(): void {
    this.currencyControl.valueChanges.subscribe(value => {
      if (value) {
        this.corporationSettings.currency = value;
      }
    });

    this.currencyControl.setValue(this.corporationSettings.currency);
  }

  switchTab(tab: 'basic' | 'network'): void {
    this.activeTab = tab;
  }

  onSave(): void {
    console.log('Сохранение настроек корпорации:', this.corporationSettings);
  }
}
