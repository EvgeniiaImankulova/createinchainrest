let legalEntities = [
  {
    id: '1',
    name: 'ООО "Вкусная еда"',
    description: 'Сеть ресторанов быстрого питания',
    inn: '7743012345',
    kpp: '774301001',
    address: 'г. Москва, ул. Тверская, д. 10',
    phone: '+7 (495) 123-45-67',
    email: 'info@vkusnaya-eda.ru'
  },
  {
    id: '2',
    name: 'ООО "Гастроном"',
    description: 'Ресторанный холдинг',
    inn: '7701234567',
    kpp: '770101001',
    address: 'г. Москва, пр-т Мира, д. 150',
    phone: '+7 (495) 987-65-43',
    email: 'contact@gastronomgroup.ru'
  }
];

let restaurants = [
  {
    id: 'r1',
    name: 'Ресторан "Марина Даймонд"',
    legalEntityId: '1',
    address: '20/2, улица Советская, Кострома',
    city: 'Кострома',
    timezone: '(UTC+3:00) Европа/Москва',
    description: '',
    uid: '123-123-123',
    kpp: ''
  },
  {
    id: 'r2',
    name: 'Кафе "Мамзар Центр"',
    legalEntityId: '1',
    address: 'переулок Джамбула, 21, Санкт-Петербург',
    city: 'Санкт-Петербург',
    timezone: '(UTC+3:00) Европа/Москва',
    description: '',
    uid: '456-456-456',
    kpp: ''
  },
  {
    id: 'r3',
    name: 'Ресторан "Вафи Молл"',
    legalEntityId: '2',
    address: 'оренбургская область, Клишева, деревня Клёшнева',
    city: 'Клёшнева',
    timezone: '(UTC+11:00) Азия/Среднеколымск',
    description: '',
    uid: '789-789-789',
    kpp: ''
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
  document.getElementById('restaurantName').value = '';
  document.getElementById('restaurantDescription').value = '';
  document.getElementById('restaurantUid').value = Math.random().toString(36).substr(2, 9);
  document.getElementById('restaurantKpp').value = '';
  document.getElementById('restaurantLegalEntity').value = '';
  document.getElementById('restaurantCity').value = '';
  document.getElementById('restaurantAddress').value = '';
  document.getElementById('restaurantTimezone').textContent = '';

  openSidebar('restaurant');
}

function openLegalEntityForm() {
  toggleCreateMenu();
  currentEditingLegalEntity = null;

  document.getElementById('legalEntityTitle').textContent = 'Новое юридическое лицо';
  document.getElementById('legalEntityName').value = '';
  document.getElementById('legalEntityDescription').value = '';
  document.getElementById('legalEntityInn').value = '';
  document.getElementById('legalEntityKpp').value = '';
  document.getElementById('legalEntityAddress').value = '';
  document.getElementById('legalEntityPhone').value = '';
  document.getElementById('legalEntityEmail').value = '';

  openSidebar('legalEntity');
}

function editRestaurant(restaurantId) {
  const restaurant = restaurants.find(r => r.id === restaurantId);
  if (!restaurant) return;

  currentEditingRestaurant = restaurant;

  document.getElementById('restaurantTitle').textContent = restaurant.name;
  document.getElementById('restaurantName').value = restaurant.name;
  document.getElementById('restaurantDescription').value = restaurant.description;
  document.getElementById('restaurantUid').value = restaurant.uid;
  document.getElementById('restaurantKpp').value = restaurant.kpp;
  document.getElementById('restaurantLegalEntity').value = restaurant.legalEntityId;
  document.getElementById('restaurantCity').value = restaurant.city;
  document.getElementById('restaurantAddress').value = restaurant.address;
  document.getElementById('restaurantTimezone').textContent = 'Часовой пояс: ' + restaurant.timezone;

  openSidebar('restaurant');
}

function editLegalEntity(legalEntityId) {
  const legalEntity = legalEntities.find(le => le.id === legalEntityId);
  if (!legalEntity) return;

  currentEditingLegalEntity = legalEntity;

  document.getElementById('legalEntityTitle').textContent = legalEntity.name;
  document.getElementById('legalEntityName').value = legalEntity.name;
  document.getElementById('legalEntityDescription').value = legalEntity.description;
  document.getElementById('legalEntityInn').value = legalEntity.inn;
  document.getElementById('legalEntityKpp').value = legalEntity.kpp;
  document.getElementById('legalEntityAddress').value = legalEntity.address;
  document.getElementById('legalEntityPhone').value = legalEntity.phone;
  document.getElementById('legalEntityEmail').value = legalEntity.email;

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

function setActiveTab(tab) {
  const tabs = document.querySelectorAll('.sidebar-tab');
  tabs.forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}

function saveRestaurant() {
  const formData = {
    name: document.getElementById('restaurantName').value,
    description: document.getElementById('restaurantDescription').value,
    uid: document.getElementById('restaurantUid').value,
    kpp: document.getElementById('restaurantKpp').value,
    legalEntityId: document.getElementById('restaurantLegalEntity').value,
    city: document.getElementById('restaurantCity').value,
    address: document.getElementById('restaurantAddress').value,
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
    address: document.getElementById('legalEntityAddress').value,
    phone: document.getElementById('legalEntityPhone').value,
    email: document.getElementById('legalEntityEmail').value
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
