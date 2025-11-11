document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.querySelectorAll('.menu-item');
  const submenuItems = document.querySelectorAll('.submenu-item');
  const contentArea = document.getElementById('content-area');

  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      const route = this.getAttribute('data-route');
      const parent = this.getAttribute('data-parent');

      if (route) {
        setActiveMenuItem(this);
        loadContent(route);
      }

      if (parent) {
        toggleSubmenu(parent);
      }
    });
  });

  submenuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      const route = this.getAttribute('data-route');

      if (route) {
        setActiveSubmenuItem(this);
        loadContent(route);
      }
    });
  });

  function toggleSubmenu(parent) {
    const parentItem = document.querySelector(`.menu-item[data-parent="${parent}"]`);
    const submenu = document.querySelector(`.submenu[data-parent="${parent}"]`);

    if (parentItem && submenu) {
      const isExpanded = submenu.classList.contains('expanded');

      document.querySelectorAll('.submenu').forEach(s => s.classList.remove('expanded'));
      document.querySelectorAll('.menu-item.with-submenu').forEach(m => m.classList.remove('expanded'));

      if (!isExpanded) {
        submenu.classList.add('expanded');
        parentItem.classList.add('expanded');
      }
    }
  }

  function setActiveMenuItem(clickedItem) {
    menuItems.forEach(item => {
      item.classList.remove('active');
      item.classList.remove('active-parent');
    });
    submenuItems.forEach(item => item.classList.remove('active'));

    clickedItem.classList.add('active');
  }

  function setActiveSubmenuItem(clickedItem) {
    const parent = clickedItem.closest('.submenu').getAttribute('data-parent');
    const parentItem = document.querySelector(`.menu-item[data-parent="${parent}"]`);

    menuItems.forEach(item => {
      item.classList.remove('active');
      item.classList.remove('active-parent');
    });
    submenuItems.forEach(item => item.classList.remove('active'));

    clickedItem.classList.add('active');

    if (parentItem) {
      parentItem.classList.add('active-parent');
    }
  }

  function loadContent(route) {
    const routeMap = {
      '/settings/general': 'Общие настройки',
      '/settings/forecasting': 'Прогнозирование',
      '/settings/corporation': 'Настройки корпорации',
      '/restaurants/templates': 'Шаблоны',
      '/restaurants/receipt-templates': 'Шаблоны чеков',
      '/restaurants/list': 'Рестораны',
      '/restaurants/commissions': 'Комиссии агрегаторов',
      '/restaurants/panels': 'Панели',
      '/restaurants/auto-add-dishes': 'Автодобавление блюд',
      '/restaurants/iikocard-networks': 'Управление сетями iikoCard',
      '/warehouse': 'Склад',
      '/analytics': 'Аналитика',
      '/notifications': 'Оповещения',
      '/staff': 'Персонал',
      '/beer-marking': 'Маркировка разливного пива',
      '/events': 'События'
    };

    const title = routeMap[route] || 'Страница не найдена';
    contentArea.innerHTML = `
      <h1 style="margin-bottom: 16px; font-size: 24px; font-weight: 400; color: var(--text-primary);">${title}</h1>
      <p style="color: var(--text-secondary);">Содержимое раздела "${title}"</p>
    `;
  }
});
