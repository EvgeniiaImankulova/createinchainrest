import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService, LegalEntity as SupabaseLegalEntity } from '../../services/supabase.service';
import { SearchableSelectComponent, SelectOption } from '../../components/searchable-select/searchable-select.component';
import { Employee, getEmployeeFullName } from '../../models/employee.model';
import { LegalEntityGroup } from '../../models/legal-entity-group.model';

interface Restaurant {
  id: string;
  name: string;
  legalEntityId: string;
  legalEntity: string;
  address: string;
  template: string;
  timezone: string;
  isFranchise?: boolean;
  isDraft?: boolean;
}

interface LegalEntity {
  id: string;
  name: string;
  description: string;
  inn: string;
  kpp: string;
  okpo: string;
  ogrn: string;
  legalAddress: string;
  phone: string;
  bankAccount: string;
  bik: string;
  bankName: string;
  bankCity: string;
  correspondentAccount: string;
  registrationNumber: string;
  directorName: string;
  directorPosition: string;
  email: string;
  accountantName: string;
  chiefTechnologistName: string;
  productionManagerName: string;
  isDraft?: boolean;
  is_franchise?: boolean;
  group_id?: string;
  groupName?: string;
}

@Component({
  selector: 'app-restaurants-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableSelectComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class RestaurantsListComponent implements OnInit {
  currentRoute: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
    this.currentRoute = this.router.url;
    await this.loadData();
  }

  async loadData() {
    try {
      const [legalEntities, restaurants, groups] = await Promise.all([
        this.supabaseService.getLegalEntities(),
        this.supabaseService.getRestaurants(),
        this.supabaseService.getLegalEntityGroups()
      ]);

      if (groups && groups.length > 0) {
        this.groups = groups;
      } else {
        this.groups = this.mockGroups;
      }

      if (legalEntities && legalEntities.length > 0) {
        this.legalEntitiesData = legalEntities.map((le: any) => ({
          id: le.id,
          name: le.name,
          description: le.legal_name || '',
          inn: le.inn || '',
          kpp: le.kpp || '',
          okpo: '',
          ogrn: le.ogrn || '',
          legalAddress: le.legal_address || '',
          phone: le.phone || '',
          bankAccount: le.payment_account || '',
          bik: le.bik || '',
          bankName: le.bank_name || '',
          bankCity: '',
          correspondentAccount: le.correspondent_account || '',
          registrationNumber: '',
          directorName: le.director || '',
          directorPosition: '',
          email: le.email || '',
          accountantName: le.accountant || '',
          chiefTechnologistName: '',
          productionManagerName: '',
          isDraft: le.is_draft || false,
          is_franchise: le.is_franchise || false,
          group_id: le.group_id || undefined
        }));
      }

      if (restaurants && restaurants.length > 0) {
        this.restaurants = restaurants.map((r: any) => {
          const legalEntity = this.legalEntitiesData.find(le => le.id === r.legal_entity_id);
          const isGastronomRestaurant = legalEntity?.name.toLowerCase().includes('гастроном');

          return {
            id: r.id,
            name: r.name,
            legalEntityId: r.legal_entity_id || '',
            legalEntity: '',
            address: r.address || '',
            template: r.template || '',
            timezone: r.timezone || '',
            isFranchise: isGastronomRestaurant || legalEntity?.is_franchise || false,
            isDraft: r.is_draft || false
          };
        });
      }

      this.legalEntitiesData.forEach(le => {
        this.expandedLegalEntities.add(le.id);
      });

      this.groups.forEach(g => {
        if (g.id) {
          this.expandedGroups.add(g.id);
        }
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  mockGroups: LegalEntityGroup[] = [
    {
      id: 'group-1',
      name: 'Центральный регион',
      description: 'Рестораны центрального региона'
    },
    {
      id: 'group-2',
      name: 'Северо-Западный регион',
      description: 'Рестораны Санкт-Петербурга и области'
    }
  ];

  legalEntitiesData: LegalEntity[] = [
    {
      id: '1',
      name: 'ООО "Вкусная еда"',
      description: 'Сеть ресторанов быстрого питания',
      inn: '7743012345',
      kpp: '774301001',
      okpo: '12345678',
      ogrn: '1027743012345',
      legalAddress: 'г. Москва, ул. Тверская, д. 10',
      phone: '+7 (495) 123-45-67',
      bankAccount: '40702810100000012345',
      bik: '044525225',
      bankName: 'ПАО Сбербанк',
      bankCity: 'Москва',
      correspondentAccount: '30101810400000000225',
      registrationNumber: '1234567890123',
      directorName: 'Иванов Иван Иванович',
      directorPosition: 'Генеральный директор',
      email: 'info@vkusnaya-eda.ru',
      accountantName: 'Петрова Мария Сергеевна',
      chiefTechnologistName: 'Сидоров Петр Алексеевич',
      productionManagerName: 'Кузнецова Анна Владимировна',
      is_franchise: true,
      group_id: 'group-1'
    },
    {
      id: '2',
      name: 'ООО "Гастроном"',
      description: 'Ресторанный холдинг',
      inn: '7701234567',
      kpp: '770101001',
      okpo: '87654321',
      ogrn: '1027701234567',
      legalAddress: 'г. Москва, пр-т Мира, д. 150',
      phone: '+7 (495) 987-65-43',
      bankAccount: '40702810200000098765',
      bik: '044525225',
      bankName: 'ПАО Сбербанк',
      bankCity: 'Москва',
      correspondentAccount: '30101810400000000225',
      registrationNumber: '9876543210987',
      directorName: 'Смирнов Алексей Петрович',
      directorPosition: 'Генеральный директор',
      email: 'contact@gastronomgroup.ru',
      accountantName: 'Волкова Елена Ивановна',
      chiefTechnologistName: 'Морозов Дмитрий Николаевич',
      productionManagerName: 'Соколова Ольга Андреевна',
      is_franchise: false,
      group_id: 'group-1'
    },
    {
      id: '3',
      name: 'ИП Федоров А.С.',
      description: 'Индивидуальный предприниматель',
      inn: '773456789012',
      kpp: '',
      okpo: '45678901',
      ogrn: '304773456789012',
      legalAddress: 'г. Санкт-Петербург, Невский пр-т, д. 25',
      phone: '+7 (812) 555-12-34',
      bankAccount: '40802810500000054321',
      bik: '044030653',
      bankName: 'ВТБ',
      bankCity: 'Санкт-Петербург',
      correspondentAccount: '30101810200000000653',
      registrationNumber: '321654987321',
      directorName: 'Федоров Андрей Сергеевич',
      directorPosition: 'Индивидуальный предприниматель',
      email: 'fedorov@restaurant.spb.ru',
      accountantName: 'Новикова Татьяна Викторовна',
      chiefTechnologistName: 'Павлов Игорь Юрьевич',
      productionManagerName: 'Михайлова Светлана Павловна',
      is_franchise: false,
      group_id: 'group-2'
    },
    {
      id: '4',
      name: 'ООО "Ресторанные технологии"',
      description: 'Управляющая компания',
      inn: '7745098765',
      kpp: '774501001',
      okpo: '11223344',
      ogrn: '1027745098765',
      legalAddress: 'г. Москва, ул. Ленинградская, д. 35',
      phone: '+7 (495) 777-88-99',
      bankAccount: '40702810300000033333',
      bik: '044525225',
      bankName: 'ПАО Сбербанк',
      bankCity: 'Москва',
      correspondentAccount: '30101810400000000225',
      registrationNumber: '5555666677778',
      directorName: 'Николаев Сергей Владимирович',
      directorPosition: 'Генеральный директор',
      email: 'info@restech.ru',
      accountantName: 'Алексеева Ирина Павловна',
      chiefTechnologistName: 'Григорьев Максим Дмитриевич',
      productionManagerName: 'Романова Екатерина Сергеевна',
      is_franchise: false,
      group_id: 'group-1'
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
      timezone: '(UTC+3:00) Европа/Москва',
      isFranchise: true
    },
    {
      id: 'r2',
      name: 'Кафе "Мамзар Центр"',
      legalEntityId: '1',
      legalEntity: 'ООО "Вкусная еда"',
      address: 'переулок Джамбула, 21, Санкт-Петербург, Санкт-Петербург, Russia',
      template: 'Default',
      timezone: '(UTC+3:00) Европа/Москва',
      isFranchise: true
    },
    {
      id: 'r3',
      name: 'Ресторан "Вафи Молл"',
      legalEntityId: '2',
      legalEntity: 'ООО "Гастроном"',
      address: 'оренбургская область, Клишева, деревня Клёшнева',
      template: 'Default',
      timezone: '(UTC+11:00) Азия/Среднеколымск',
      isFranchise: false
    },
    {
      id: 'r4',
      name: 'Столовая "На Варшавке"',
      legalEntityId: '1',
      legalEntity: 'ООО "Вкусная еда"',
      address: 'Москва, Москва, Варшавское шоссе, 118к1',
      template: 'WEB-11353-без-дневных-интеров',
      timezone: '(UTC+3:00) Европа/Москва',
      isFranchise: true
    },
    {
      id: 'r5',
      name: 'Бистро "Центральное"',
      legalEntityId: '4',
      legalEntity: 'ООО "Ресторанные технологии"',
      address: 'г. Москва, ул. Тверская, д. 25',
      template: 'Default',
      timezone: '(UTC+3:00) Европа/Москва',
      isFranchise: false
    }
  ];

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showCreateMenu: boolean = false;
  showSidebar: boolean = false;
  showLegalEntitySidebar: boolean = false;
  showSuccessModal: boolean = false;
  activeTab: string = 'general';
  sidebarMode: 'restaurant' | 'legalEntity' = 'restaurant';
  emailError: string = '';

  expandedLegalEntities: Set<string> = new Set();
  expandedGroups: Set<string> = new Set();
  groups: LegalEntityGroup[] = [];

  employees: Employee[] = [
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

  get legalEntities() {
    return this.legalEntitiesData.map(le => ({ id: le.id, name: le.name }));
  }

  get legalEntityOptions(): SelectOption[] {
    return this.legalEntitiesData.map(le => ({
      value: le.id,
      label: le.name
    }));
  }

  get employeeOptions(): SelectOption[] {
    return this.employees.map(emp => ({
      value: emp.id!,
      label: getEmployeeFullName(emp)
    }));
  }

  get templateOptions(): SelectOption[] {
    return [
      { value: 'WEB-11353-без-дневных-интеров', label: 'WEB-11353-без-дневных-интеров' },
      { value: 'Default', label: 'Default' }
    ];
  }

  isLegalEntityFranchise(legalEntityId: string): boolean {
    const legalEntity = this.legalEntitiesData.find(le => le.id === legalEntityId);
    if (legalEntity?.name.toLowerCase().includes('гастроном')) {
      return true;
    }

    const childRestaurants = this.restaurants.filter(r => r.legalEntityId === legalEntityId);
    if (childRestaurants.length === 0) return false;
    return childRestaurants.some(r => r.isFranchise);
  }

  get hierarchyItems() {
    const items: any[] = [];

    this.groups.forEach(group => {
      if (!group.id) return;

      items.push({
        id: group.id,
        type: 'group',
        name: group.name,
        description: group.description,
        isExpanded: this.expandedGroups.has(group.id),
        level: 0,
        data: group
      });

      if (this.expandedGroups.has(group.id)) {
        const legalEntitiesInGroup = this.legalEntitiesData.filter(le => le.group_id === group.id);

        legalEntitiesInGroup.forEach(legalEntity => {
          items.push({
            id: legalEntity.id,
            type: 'legalEntity',
            name: legalEntity.name,
            isExpanded: this.expandedLegalEntities.has(legalEntity.id),
            isFranchise: this.isLegalEntityFranchise(legalEntity.id),
            isDraft: legalEntity.isDraft,
            level: 1,
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
                isFranchise: restaurant.isFranchise,
                isDraft: restaurant.isDraft,
                level: 2,
                data: restaurant
              });
            });
          }
        });
      }
    });

    const legalEntitiesWithoutGroup = this.legalEntitiesData.filter(le => !le.group_id);
    legalEntitiesWithoutGroup.forEach(legalEntity => {
      items.push({
        id: legalEntity.id,
        type: 'legalEntity',
        name: legalEntity.name,
        isExpanded: this.expandedLegalEntities.has(legalEntity.id),
        isFranchise: this.isLegalEntityFranchise(legalEntity.id),
        isDraft: legalEntity.isDraft,
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
            isFranchise: restaurant.isFranchise,
            isDraft: restaurant.isDraft,
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
    ogrn: '',
    legalAddress: '',
    phone: '',
    bankAccount: '',
    bik: '',
    bankName: '',
    bankCity: '',
    correspondentAccount: '',
    registrationNumber: '',
    directorName: '',
    directorPosition: '',
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
    this.router.navigate(['/network-settings/restaurants/legal-entity/new']);
  }

  onCreateRestaurant(): void {
    this.showCreateMenu = false;
    this.router.navigate(['/network-settings/restaurants/restaurant/new']);
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

  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.restaurantForm.email) {
      this.emailError = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(this.restaurantForm.email)) {
      this.emailError = 'Введите корректный email адрес';
    } else {
      this.emailError = '';
    }
  }

  onSave(): void {
    if (this.sidebarMode === 'restaurant') {
      this.validateEmail();

      if (this.emailError) {
        return;
      }

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

      this.closeSidebar();
      this.showSuccessModal = true;
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
      this.closeSidebar();
    }
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  onFilter(): void {
    console.log('Filter');
  }

  onEditRestaurant(restaurant: Restaurant): void {
    this.router.navigate(['/network-settings/restaurants/restaurant', restaurant.id]);
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

  toggleGroup(groupId: string): void {
    if (this.expandedGroups.has(groupId)) {
      this.expandedGroups.delete(groupId);
    } else {
      this.expandedGroups.add(groupId);
    }
  }

  onEditLegalEntity(legalEntity: LegalEntity): void {
    this.router.navigate(['/network-settings/restaurants/legal-entity', legalEntity.id]);
  }
}
