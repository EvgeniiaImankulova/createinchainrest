let legalEntities = [
  {
    id: '1',
    name: 'ООО "Вкусная еда"',
    description: 'Сеть ресторанов быстрого питания',
    inn: '7743012345',
    kpp: '774301001',
    okpo: '12345678',
    address: 'г. Москва, ул. Тверская, д. 10',
    phone: '+7 (495) 123-45-67',
    email: 'info@vkusnaya-eda.ru',
    bankAccount: '40702810100000012345',
    bik: '044525225',
    bankName: 'ПАО Сбербанк',
    bankCity: 'Москва',
    corrAccount: '30101810400000000225',
    regNumber: '1234567890123',
    director: 'Иванов Иван Иванович',
    accountant: 'Петрова Мария Сергеевна',
    chiefTech: 'Сидоров Петр Алексеевич',
    prodManager: 'Кузнецова Анна Владимировна'
  },
  {
    id: '2',
    name: 'ООО "Гастроном"',
    description: 'Ресторанный холдинг',
    inn: '7701234567',
    kpp: '770101001',
    okpo: '87654321',
    address: 'г. Москва, пр-т Мира, д. 150',
    phone: '+7 (495) 987-65-43',
    email: 'contact@gastronomgroup.ru',
    bankAccount: '40702810200000098765',
    bik: '044525225',
    bankName: 'ПАО Сбербанк',
    bankCity: 'Москва',
    corrAccount: '30101810400000000225',
    regNumber: '9876543210987',
    director: 'Смирнов Алексей Петрович',
    accountant: 'Волкова Елена Ивановна',
    chiefTech: 'Морозов Дмитрий Николаевич',
    prodManager: 'Соколова Ольга Андреевна'
  }
];

let restaurants = [
  {
    id: 'r1',
    name: 'Ресторан "Марина Даймонд"',
    description: '',
    shortName: '',
    code: '',
    uid: '123-456-789',
    kpp: '',
    royalty: 0,
    category1: '',
    category2: '',
    category3: '',
    category4: '',
    category5: '',
    email: '',
    template: 'WEB-11353-без-дневных-интеров',
    legalEntityId: '1',
    isFranchise: false,
    uploadFromCO: false,
    downloadToCO: false,
    receiveDirectories: false,
    legalAddress: '',
    city: 'Кострома',
    region: 'Костромская область',
    country: 'Россия',
    address: '20/2, улица Советская',
    addressComment: '',
    latitude: 57.7665,
    longitude: 40.9265,
    timezone: '(UTC+3:00) Европа/Москва'
  },
  {
    id: 'r2',
    name: 'Кафе "Мамзар Центр"',
    description: '',
    shortName: '',
    code: '',
    uid: '987-654-321',
    kpp: '',
    royalty: 0,
    category1: '',
    category2: '',
    category3: '',
    category4: '',
    category5: '',
    email: '',
    template: 'Default',
    legalEntityId: '1',
    isFranchise: false,
    uploadFromCO: false,
    downloadToCO: false,
    receiveDirectories: false,
    legalAddress: '',
    city: 'Санкт-Петербург',
    region: 'Санкт-Петербург',
    country: 'Россия',
    address: 'переулок Джамбула, 21',
    addressComment: '',
    latitude: 59.9311,
    longitude: 30.3609,
    timezone: '(UTC+3:00) Европа/Москва'
  },
  {
    id: 'r3',
    name: 'Ресторан "Вафи Молл"',
    description: '',
    shortName: '',
    code: '',
    uid: '456-789-123',
    kpp: '',
    royalty: 0,
    category1: '',
    category2: '',
    category3: '',
    category4: '',
    category5: '',
    email: '',
    template: 'Default',
    legalEntityId: '2',
    isFranchise: false,
    uploadFromCO: false,
    downloadToCO: false,
    receiveDirectories: false,
    legalAddress: '',
    city: 'Клёшнева',
    region: 'оренбургская область',
    country: 'Россия',
    address: 'деревня Клёшнева',
    addressComment: '',
    latitude: 0,
    longitude: 0,
    timezone: '(UTC+11:00) Азия/Среднеколымск'
  }
];

let expandedLegalEntities = new Set();
let currentEditingRestaurant = null;
let currentEditingLegalEntity = null;

document.addEventListener('DOMContentLoaded', function() {
  renderHierarchy();
  populateLegalEntitySelect();
});

function renderHierarchy() {
  const tbody = document.getElementById('hierarchyTableBody');
  tbody.innerHTML = '';
  let rowNumber = 1;

  legalEntities.forEach(legalEntity => {
    const isExpanded = expandedLegalEntities.has(legalEntity.id);

    const tr = document.createElement('tr');
    tr.className = 'legal-entity-row';
    tr.innerHTML = `
      <td class="col-number">${rowNumber++}</td>
      <td>
        <div class="hierarchy-cell">
          <button class="expand-btn ${isExpanded ? 'expanded' : ''}" onclick="toggleLegalEntity('${legalEntity.id}')">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <span class="item-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 18V8L10 3L17 8V18H12V13H8V18H3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
          </span>
          <span class="link" onclick="editLegalEntity('${legalEntity.id}')">${legalEntity.name}</span>
        </div>
      </td>
      <td>
        <span class="type-badge type-legal">Юридическое лицо</span>
      </td>
    `;
    tbody.appendChild(tr);

    if (isExpanded) {
      const childRestaurants = restaurants.filter(r => r.legalEntityId === legalEntity.id);
      childRestaurants.forEach(restaurant => {
        const rtr = document.createElement('tr');
        rtr.className = 'restaurant-row';
        rtr.innerHTML = `
          <td class="col-number">${rowNumber++}</td>
          <td>
            <div class="hierarchy-cell" style="padding-left: 24px;">
              <span class="item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 8H17M6 4V8M10 4V8M14 4V8M4 8H16C16.5523 8 17 8.44772 17 9V17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17V9C3 8.44772 3.44772 8 4 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
              </span>
              <span class="link" onclick="editRestaurant('${restaurant.id}')">${restaurant.name}</span>
            </div>
          </td>
          <td>
            <span class="type-badge type-restaurant">Ресторан</span>
          </td>
        `;
        tbody.appendChild(rtr);
      });
    }
  });
}

function toggleLegalEntity(legalEntityId) {
  if (expandedLegalEntities.has(legalEntityId)) {
    expandedLegalEntities.delete(legalEntityId);
  } else {
    expandedLegalEntities.add(legalEntityId);
  }
  renderHierarchy();
}

function toggleCreateMenu() {
  const menu = document.getElementById('createMenu');
  menu.classList.toggle('show');
}

function populateLegalEntitySelect() {
  const select = document.getElementById('restaurantLegalEntity');
  select.innerHTML = '<option value="">Выберите юридическое лицо</option>';
  legalEntities.forEach(le => {
    const option = document.createElement('option');
    option.value = le.id;
    option.textContent = le.name;
    select.appendChild(option);
  });
}

function openRestaurantForm() {
  toggleCreateMenu();
  currentEditingRestaurant = null;

  document.getElementById('restaurantTitle').textContent = 'Новый ресторан';
  clearRestaurantForm();
  document.getElementById('restaurantUid').value = Math.random().toString(36).substr(2, 11).toUpperCase();

  openSidebar('restaurant');
}

function openLegalEntityForm() {
  toggleCreateMenu();
  currentEditingLegalEntity = null;

  document.getElementById('legalEntityTitle').textContent = 'Новое юридическое лицо';
  clearLegalEntityForm();

  openSidebar('legalEntity');
}

function clearRestaurantForm() {
  document.getElementById('restaurantName').value = '';
  document.getElementById('restaurantDescription').value = '';
  document.getElementById('restaurantShortName').value = '';
  document.getElementById('restaurantCode').value = '';
  document.getElementById('restaurantKpp').value = '';
  document.getElementById('restaurantRoyalty').value = '';
  document.getElementById('restaurantCategory1').value = '';
  document.getElementById('restaurantCategory2').value = '';
  document.getElementById('restaurantCategory3').value = '';
  document.getElementById('restaurantCategory4').value = '';
  document.getElementById('restaurantCategory5').value = '';
  document.getElementById('restaurantEmail').value = '';
  document.getElementById('restaurantTemplate').value = 'Default';
  document.getElementById('restaurantLegalEntity').value = '';
  document.getElementById('restaurantIsFranchise').checked = false;
  document.getElementById('restaurantUploadFromCO').checked = false;
  document.getElementById('restaurantDownloadToCO').checked = false;
  document.getElementById('restaurantReceiveDirectories').checked = false;
  document.getElementById('restaurantLegalAddress').value = '';
  document.getElementById('restaurantCity').value = '';
  document.getElementById('restaurantRegion').value = '';
  document.getElementById('restaurantCountry').value = '';
  document.getElementById('restaurantAddress').value = '';
  document.getElementById('restaurantAddressComment').value = '';
  document.getElementById('restaurantLatitude').value = '';
  document.getElementById('restaurantLongitude').value = '';
  document.getElementById('restaurantTimezone').textContent = 'Часовой пояс: (UTC+3:00) Европа/Москва';
}

function clearLegalEntityForm() {
  document.getElementById('legalEntityName').value = '';
  document.getElementById('legalEntityDescription').value = '';
  document.getElementById('legalEntityInn').value = '';
  document.getElementById('legalEntityKpp').value = '';
  document.getElementById('legalEntityOgrn').value = '';
  document.getElementById('legalEntityOkpo').value = '';
  document.getElementById('legalEntityOkved').value = '';
  document.getElementById('legalEntityIfnsCode').value = '';
  document.getElementById('legalEntityRegDate').value = '';
  document.getElementById('legalEntityStatus').value = '';
  document.getElementById('legalEntityAddress').value = '';
  document.getElementById('legalEntityPhone').value = '';
  document.getElementById('legalEntityEmail').value = '';
  document.getElementById('legalEntityBankAccount').value = '';
  document.getElementById('legalEntityBik').value = '';
  document.getElementById('legalEntityCorrAccount').value = '';
  document.getElementById('legalEntityBankName').value = '';
  document.getElementById('legalEntityBankCity').value = '';
  document.getElementById('legalEntityDirectorPost').value = '';
  document.getElementById('legalEntityDirector').value = '';
  document.getElementById('legalEntityAccountant').value = '';
  document.getElementById('legalEntityChiefTech').value = '';
  document.getElementById('legalEntityProdManager').value = '';
}

function editRestaurant(restaurantId) {
  const restaurant = restaurants.find(r => r.id === restaurantId);
  if (!restaurant) return;

  currentEditingRestaurant = restaurant;

  document.getElementById('restaurantTitle').textContent = restaurant.name;
  document.getElementById('restaurantName').value = restaurant.name;
  document.getElementById('restaurantDescription').value = restaurant.description;
  document.getElementById('restaurantShortName').value = restaurant.shortName;
  document.getElementById('restaurantCode').value = restaurant.code;
  document.getElementById('restaurantUid').value = restaurant.uid;
  document.getElementById('restaurantKpp').value = restaurant.kpp;
  document.getElementById('restaurantRoyalty').value = restaurant.royalty;
  document.getElementById('restaurantCategory1').value = restaurant.category1;
  document.getElementById('restaurantCategory2').value = restaurant.category2;
  document.getElementById('restaurantCategory3').value = restaurant.category3;
  document.getElementById('restaurantCategory4').value = restaurant.category4;
  document.getElementById('restaurantCategory5').value = restaurant.category5;
  document.getElementById('restaurantEmail').value = restaurant.email;
  document.getElementById('restaurantTemplate').value = restaurant.template;
  document.getElementById('restaurantLegalEntity').value = restaurant.legalEntityId;
  document.getElementById('restaurantIsFranchise').checked = restaurant.isFranchise;
  document.getElementById('restaurantUploadFromCO').checked = restaurant.uploadFromCO;
  document.getElementById('restaurantDownloadToCO').checked = restaurant.downloadToCO;
  document.getElementById('restaurantReceiveDirectories').checked = restaurant.receiveDirectories;
  document.getElementById('restaurantLegalAddress').value = restaurant.legalAddress;
  document.getElementById('restaurantCity').value = restaurant.city;
  document.getElementById('restaurantRegion').value = restaurant.region;
  document.getElementById('restaurantCountry').value = restaurant.country;
  document.getElementById('restaurantAddress').value = restaurant.address;
  document.getElementById('restaurantAddressComment').value = restaurant.addressComment;
  document.getElementById('restaurantLatitude').value = restaurant.latitude;
  document.getElementById('restaurantLongitude').value = restaurant.longitude;
  document.getElementById('restaurantTimezone').textContent = 'Часовой пояс: ' + restaurant.timezone;

  openSidebar('restaurant');
}

function editLegalEntity(legalEntityId) {
  const legalEntity = legalEntities.find(le => le.id === legalEntityId);
  if (!legalEntity) return;

  currentEditingLegalEntity = legalEntity;

  document.getElementById('legalEntityTitle').textContent = legalEntity.name;
  document.getElementById('legalEntityName').value = legalEntity.name;
  document.getElementById('legalEntityDescription').value = legalEntity.description || '';
  document.getElementById('legalEntityInn').value = legalEntity.inn;
  document.getElementById('legalEntityKpp').value = legalEntity.kpp;
  document.getElementById('legalEntityOgrn').value = legalEntity.ogrn || '';
  document.getElementById('legalEntityOkpo').value = legalEntity.okpo || '';
  document.getElementById('legalEntityOkved').value = legalEntity.okved || '';
  document.getElementById('legalEntityIfnsCode').value = legalEntity.ifnsCode || '';
  document.getElementById('legalEntityRegDate').value = legalEntity.regDate || '';
  document.getElementById('legalEntityStatus').value = legalEntity.status || '';
  document.getElementById('legalEntityAddress').value = legalEntity.address;
  document.getElementById('legalEntityPhone').value = legalEntity.phone;
  document.getElementById('legalEntityEmail').value = legalEntity.email;
  document.getElementById('legalEntityBankAccount').value = legalEntity.bankAccount;
  document.getElementById('legalEntityBik').value = legalEntity.bik;
  document.getElementById('legalEntityCorrAccount').value = legalEntity.corrAccount;
  document.getElementById('legalEntityBankName').value = legalEntity.bankName;
  document.getElementById('legalEntityBankCity').value = legalEntity.bankCity;
  document.getElementById('legalEntityDirectorPost').value = legalEntity.directorPost || '';
  document.getElementById('legalEntityDirector').value = legalEntity.director;
  document.getElementById('legalEntityAccountant').value = legalEntity.accountant || '';
  document.getElementById('legalEntityChiefTech').value = legalEntity.chiefTech || '';
  document.getElementById('legalEntityProdManager').value = legalEntity.prodManager || '';

  openSidebar('legalEntity');
}

function openSidebar(type) {
  const overlay = document.getElementById('sidebarOverlay');
  const restaurantSidebar = document.getElementById('restaurantSidebar');
  const legalEntitySidebar = document.getElementById('legalEntitySidebar');

  overlay.classList.add('show');

  if (type === 'restaurant') {
    restaurantSidebar.classList.add('open');
    legalEntitySidebar.classList.remove('open');
  } else {
    legalEntitySidebar.classList.add('open');
    restaurantSidebar.classList.remove('open');
  }
}

function closeSidebar() {
  const overlay = document.getElementById('sidebarOverlay');
  const restaurantSidebar = document.getElementById('restaurantSidebar');
  const legalEntitySidebar = document.getElementById('legalEntitySidebar');

  overlay.classList.remove('show');
  restaurantSidebar.classList.remove('open');
  legalEntitySidebar.classList.remove('open');
}

function setActiveTab(tabName) {
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  event.target.classList.add('active');
  document.getElementById('tab-' + tabName).classList.add('active');
}

function saveRestaurant() {
  const formData = {
    name: document.getElementById('restaurantName').value,
    description: document.getElementById('restaurantDescription').value,
    shortName: document.getElementById('restaurantShortName').value,
    code: document.getElementById('restaurantCode').value,
    uid: document.getElementById('restaurantUid').value,
    kpp: document.getElementById('restaurantKpp').value,
    royalty: parseFloat(document.getElementById('restaurantRoyalty').value) || 0,
    category1: document.getElementById('restaurantCategory1').value,
    category2: document.getElementById('restaurantCategory2').value,
    category3: document.getElementById('restaurantCategory3').value,
    category4: document.getElementById('restaurantCategory4').value,
    category5: document.getElementById('restaurantCategory5').value,
    email: document.getElementById('restaurantEmail').value,
    template: document.getElementById('restaurantTemplate').value,
    legalEntityId: document.getElementById('restaurantLegalEntity').value,
    isFranchise: document.getElementById('restaurantIsFranchise').checked,
    uploadFromCO: document.getElementById('restaurantUploadFromCO').checked,
    downloadToCO: document.getElementById('restaurantDownloadToCO').checked,
    receiveDirectories: document.getElementById('restaurantReceiveDirectories').checked,
    legalAddress: document.getElementById('restaurantLegalAddress').value,
    city: document.getElementById('restaurantCity').value,
    region: document.getElementById('restaurantRegion').value,
    country: document.getElementById('restaurantCountry').value,
    address: document.getElementById('restaurantAddress').value,
    addressComment: document.getElementById('restaurantAddressComment').value,
    latitude: parseFloat(document.getElementById('restaurantLatitude').value) || 0,
    longitude: parseFloat(document.getElementById('restaurantLongitude').value) || 0,
    timezone: '(UTC+3:00) Европа/Москва'
  };

  if (currentEditingRestaurant) {
    Object.assign(currentEditingRestaurant, formData);
  } else {
    formData.id = 'r' + Date.now();
    restaurants.push(formData);
  }

  renderHierarchy();
  closeSidebar();
  alert('Ресторан сохранен!');
}

function saveLegalEntity() {
  const formData = {
    name: document.getElementById('legalEntityName').value,
    description: document.getElementById('legalEntityDescription').value,
    inn: document.getElementById('legalEntityInn').value,
    kpp: document.getElementById('legalEntityKpp').value,
    ogrn: document.getElementById('legalEntityOgrn').value,
    okpo: document.getElementById('legalEntityOkpo').value,
    okved: document.getElementById('legalEntityOkved').value,
    ifnsCode: document.getElementById('legalEntityIfnsCode').value,
    regDate: document.getElementById('legalEntityRegDate').value,
    status: document.getElementById('legalEntityStatus').value,
    address: document.getElementById('legalEntityAddress').value,
    phone: document.getElementById('legalEntityPhone').value,
    email: document.getElementById('legalEntityEmail').value,
    bankAccount: document.getElementById('legalEntityBankAccount').value,
    bik: document.getElementById('legalEntityBik').value,
    corrAccount: document.getElementById('legalEntityCorrAccount').value,
    bankName: document.getElementById('legalEntityBankName').value,
    bankCity: document.getElementById('legalEntityBankCity').value,
    directorPost: document.getElementById('legalEntityDirectorPost').value,
    director: document.getElementById('legalEntityDirector').value,
    accountant: document.getElementById('legalEntityAccountant').value,
    chiefTech: document.getElementById('legalEntityChiefTech').value,
    prodManager: document.getElementById('legalEntityProdManager').value
  };

  if (currentEditingLegalEntity) {
    Object.assign(currentEditingLegalEntity, formData);
  } else {
    formData.id = 'le' + Date.now();
    legalEntities.push(formData);
  }

  renderHierarchy();
  populateLegalEntitySelect();
  closeSidebar();
  alert('Юридическое лицо сохранено!');
}

document.addEventListener('click', function(e) {
  const createMenu = document.getElementById('createMenu');
  if (!e.target.closest('.create-menu-container')) {
    createMenu.classList.remove('show');
  }
});

async function fetchCompanyDataByInn() {
  const innInput = document.getElementById('legalEntityInn');
  const inn = innInput.value.trim();

  if (!inn || inn.length < 10) {
    return;
  }

  try {
    const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Token 8b7f0ef05a236baa3a5ec7088447dcf3ad71ce24'
      },
      body: JSON.stringify({ query: inn })
    });

    if (!response.ok) {
      console.error('Ошибка при запросе к API');
      return;
    }

    const data = await response.json();

    if (data.suggestions && data.suggestions.length > 0) {
      const company = data.suggestions[0].data;

      if (company.name && company.name.full_with_opf) {
        document.getElementById('legalEntityName').value = company.name.full_with_opf;
      }

      if (company.kpp) {
        document.getElementById('legalEntityKpp').value = company.kpp;
      }

      if (company.ogrn) {
        document.getElementById('legalEntityOgrn').value = company.ogrn;
      }

      if (company.okpo) {
        document.getElementById('legalEntityOkpo').value = company.okpo;
      }

      if (company.okved) {
        document.getElementById('legalEntityOkved').value = company.okved;
      }

      if (company.management && company.management.name) {
        document.getElementById('legalEntityDirector').value = company.management.name;
      }

      if (company.management && company.management.post) {
        document.getElementById('legalEntityDirectorPost').value = company.management.post;
      }

      if (company.address && company.address.unrestricted_value) {
        document.getElementById('legalEntityAddress').value = company.address.unrestricted_value;
      }

      if (company.state && company.state.registration_date) {
        const regDate = new Date(company.state.registration_date);
        document.getElementById('legalEntityRegDate').value = regDate.toISOString().split('T')[0];
      }

      if (company.state && company.state.status) {
        const statusMap = {
          'ACTIVE': 'Действующее',
          'LIQUIDATING': 'Ликвидируется',
          'LIQUIDATED': 'Ликвидировано',
          'REORGANIZING': 'В процессе реорганизации'
        };
        document.getElementById('legalEntityStatus').value = statusMap[company.state.status] || company.state.status;
      }

      if (company.finance && company.finance.tax_system) {
        document.getElementById('legalEntityIfnsCode').value = company.finance.tax_system;
      }

      alert('Данные успешно загружены из ЕГРЮЛ');
    } else {
      alert('Организация с таким ИНН не найдена');
    }
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    alert('Не удалось получить данные организации. Проверьте подключение к интернету.');
  }
}
