import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Restaurant {
  id: string;
  name: string;
  legalEntityId: string;
  legalEntity: string;
  address: string;
  template: string;
  timezone: string;
}

interface LegalEntity {
  id: string;
  name: string;
  description: string;
  inn: string;
  kpp: string;
  okpo: string;
  legalAddress: string;
  phone: string;
  bankAccount: string;
  bik: string;
  bankName: string;
  bankCity: string;
  correspondentAccount: string;
  registrationNumber: string;
  directorName: string;
  email: string;
  accountantName: string;
  chiefTechnologistName: string;
  productionManagerName: string;
}

@Component({
  selector: 'app-restaurants-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class RestaurantsListComponent {
  legalEntitiesData: LegalEntity[] = [
    {
      id: '1',
      name: 'ООО "Вкусная еда"',
      description: 'Сеть ресторанов быстрого питания',
      inn: '7743012345',
      kpp: '774301001',
      okpo: '12345678',
      legalAddress: 'г. Москва, ул. Тверская, д. 10',
      phone: '+7 (495) 123-45-67',
      bankAccount: '40702810100000012345',
      bik: '044525225',
      bankName: 'ПАО Сбербанк',
      bankCity: 'Москва',
      correspondentAccount: '30101810400000000225',
      registrationNumber: '1234567890123',
      directorName: 'Иванов Иван Иванович',
      email: 'info@vkusnaya-eda.ru',
      accountantName: 'Петрова Мария Сергеевна',
      chiefTechnologistName: 'Сидоров Петр Алексеевич',
      productionManagerName: 'Кузнецова Анна Владимировна'
    },
    {
      id: '2',
      name: 'ООО "Гастроном"',
      description: 'Ресторанный холдинг',
      inn: '7701234567',
      kpp: '770101001',
      okpo: '87654321',
      legalAddress: 'г. Москва, пр-т Мира, д. 150',
      phone: '+7 (495) 987-65-43',
      bankAccount: '40702810200000098765',
      bik: '044525225',
      bankName: 'ПАО Сбербанк',
      bankCity: 'Москва',
      correspondentAccount: '30101810400000000225',
      registrationNumber: '9876543210987',
      directorName: 'Смирнов Алексей Петрович',
      email: 'contact@gastronomgroup.ru',
      accountantName: 'Волкова Елена Ивановна',
      chiefTechnologistName: 'Морозов Дмитрий Николаевич',
      productionManagerName: 'Соколова Ольга Андреевна'
    },
    {
      id: '3',
      name: 'ИП Федоров А.С.',
      description: 'Индивидуальный предприниматель',
      inn: '773456789012',
      kpp: '',
      okpo: '45678901',
      legalAddress: 'г. Санкт-Петербург, Невский пр-т, д. 25',
      phone: '+7 (812) 555-12-34',
      bankAccount: '40802810500000054321',
      bik: '044030653',
      bankName: 'ВТБ',
      bankCity: 'Санкт-Петербург',
      correspondentAccount: '30101810200000000653',
      registrationNumber: '321654987321',
      directorName: 'Федоров Андрей Сергеевич',
      email: 'fedorov@restaurant.spb.ru',
      accountantName: 'Новикова Татьяна Викторовна',
      chiefTechnologistName: 'Павлов Игорь Юрьевич',
      productionManagerName: 'Михайлова Светлана Павловна'
    }
  ];

  restaurants: Restaurant[] = [
    {
      id: 'r1',
      name: 'Ресторан "Марина Даймонд"',
      legalEntityId: '1',
      legalEntity: 'ООО "Вкусная еда"',
      address: '20/2, улица Советская, Кострома, Костромская область, Россия',
      template: 'WEB-11353-без-дневных-интеров',
      timezone: '(UTC+3:00) Европа/Москва'
    },
    {
      id: 'r2',
      name: 'Кафе "Мамзар Центр"',
      legalEntityId: '1',
      legalEntity: 'ООО "Вкусная еда"',
      address: 'переулок Джамбула, 21, Санкт-Петербург, Санкт-Петербург, Russia',
      template: 'Default',
      timezone: '(UTC+3:00) Европа/Москва'
    },
    {
      id: 'r3',
      name: 'Ресторан "Вафи Молл"',
      legalEntityId: '2',
      legalEntity: 'ООО "Гастроном"',
      address: 'оренбургская область, Клишева, деревня Клёшнева',
      template: 'Default',
      timezone: '(UTC+11:00) Азия/Среднеколымск'
    },
    {
      id: 'r4',
      name: 'Столовая "На Варшавке"',
      legalEntityId: '1',
      legalEntity: 'ООО "Вкусная еда"',
      address: 'Москва, Москва, Варшавское шоссе, 118к1',
      template: 'WEB-11353-без-дневных-интеров',
      timezone: '(UTC+3:00) Европа/Москва'
    }
  ];

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showCreateMenu: boolean = false;
  showSidebar: boolean = false;
  showLegalEntitySidebar: boolean = false;
  activeTab: string = 'general';
  sidebarMode: 'restaurant' | 'legalEntity' = 'restaurant';

  expandedLegalEntities: Set<string> = new Set(
    ['1', '2', '3']
  );

  get legalEntities() {
    return this.legalEntitiesData.map(le => ({ id: le.id, name: le.name }));
  }

  get hierarchyItems() {
    const items: any[] = [];

    this.legalEntitiesData.forEach(legalEntity => {
      items.push({
        id: legalEntity.id,
        type: 'legalEntity',
        name: legalEntity.name,
        isExpanded: this.expandedLegalEntities.has(legalEntity.id),
        level: 0,
        data: legalEntity
      });

      if (this.expandedLegalEntities.has(legalEntity.id)) {
        const childRestaurants = this.restaurants.filter(r => r.legalEntityId === legalEntity.id);
        childRestaurants.forEach(restaurant => {
          items.push({
            id: restaurant.id,
            type: 'restaurant',
            name: restaurant.name,
            address: restaurant.address,
            template: restaurant.template,
            timezone: restaurant.timezone,
            level: 1,
            data: restaurant
          });
        });
      }
    });

    return items;
  }

  restaurantForm = {
    name: 'Test PJP - Marina Diamond',
    description: '',
    shortName: '',
    code: '',
    status: 'connected',
    template: 'WEB-11353-без-дневных-интеров',
    timezone: '(UTC+3:00) Европа/Москва',
    royaltyPercent: 0,
    uid: '123-123-123',
    isFranchise: false,
    category1: '',
    category2: '',
    category3: '',
    category4: '',
    category5: '',
    legalEntityId: '',
    email: '',
    legalAddress: '',
    city: 'Кострома',
    region: 'Костромская область',
    country: 'Россия',
    address: '20/2, улица Советская',
    addressComment: '',
    latitude: 57.7665,
    longitude: 40.9265,
    kpp: ''
  };

  legalEntityForm = {
    name: '',
    description: '',
    inn: '',
    kpp: '',
    okpo: '',
    legalAddress: '',
    phone: '',
    bankAccount: '',
    bik: '',
    bankName: '',
    bankCity: '',
    correspondentAccount: '',
    registrationNumber: '',
    directorName: '',
    email: '',
    accountantName: '',
    chiefTechnologistName: '',
    productionManagerName: ''
  };

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  onSearch(): void {
    console.log('Search');
  }

  onCreate(): void {
    this.showCreateMenu = !this.showCreateMenu;
  }

  onCreateLegalEntity(): void {
    this.showCreateMenu = false;
    this.sidebarMode = 'legalEntity';
    this.showLegalEntitySidebar = true;
  }

  onCreateRestaurant(): void {
    this.showCreateMenu = false;
    this.sidebarMode = 'restaurant';
    this.showSidebar = true;
  }

  closeSidebar(): void {
    this.showSidebar = false;
    this.showLegalEntitySidebar = false;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onEditAddress(): void {
    console.log('Edit address');
  }

  onSave(): void {
    if (this.sidebarMode === 'restaurant') {
      console.log('Save restaurant', this.restaurantForm);
      const restaurant = this.restaurants.find(r => r.name === this.restaurantForm.name);
      if (restaurant) {
        Object.assign(restaurant, {
          name: this.restaurantForm.name,
          legalEntityId: this.restaurantForm.legalEntityId,
          address: this.restaurantForm.address,
          city: this.restaurantForm.city,
          region: this.restaurantForm.region,
          country: this.restaurantForm.country
        });
        const legalEntity = this.legalEntitiesData.find(le => le.id === this.restaurantForm.legalEntityId);
        if (legalEntity) {
          restaurant.legalEntity = legalEntity.name;
        }
      }
    } else {
      console.log('Save legal entity', this.legalEntityForm);
      const legalEntity = this.legalEntitiesData.find(le => le.name === this.legalEntityForm.name);
      if (legalEntity) {
        Object.assign(legalEntity, this.legalEntityForm);
        this.restaurants.forEach(restaurant => {
          if (restaurant.legalEntityId === legalEntity.id) {
            restaurant.legalEntity = legalEntity.name;
          }
        });
      }
    }
    this.closeSidebar();
  }

  onFilter(): void {
    console.log('Filter');
  }

  onEditRestaurant(restaurant: Restaurant): void {
    this.restaurantForm.name = restaurant.name;
    this.restaurantForm.legalEntityId = restaurant.legalEntityId;
    this.restaurantForm.address = restaurant.address;
    this.sidebarMode = 'restaurant';
    this.showSidebar = true;
  }

  onEditLegalEntityByName(legalEntityName: string): void {
    const legalEntity = this.legalEntitiesData.find(le => le.name === legalEntityName);
    if (legalEntity) {
      this.legalEntityForm = { ...legalEntity };
      this.sidebarMode = 'legalEntity';
      this.showLegalEntitySidebar = true;
    }
  }

  toggleLegalEntity(legalEntityId: string): void {
    if (this.expandedLegalEntities.has(legalEntityId)) {
      this.expandedLegalEntities.delete(legalEntityId);
    } else {
      this.expandedLegalEntities.add(legalEntityId);
    }
  }

  onEditLegalEntity(legalEntity: LegalEntity): void {
    this.legalEntityForm = { ...legalEntity };
    this.sidebarMode = 'legalEntity';
    this.showLegalEntitySidebar = true;
  }
}
