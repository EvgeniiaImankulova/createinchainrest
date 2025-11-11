let preparationPlaces = ['01 Бар', '01 Кухня', '01 Горячий цех', '02 Бар'];
let courses = [
  { number: 0, name: 'VIP' },
  { number: 1, name: 'Курс 1' },
  { number: 2, name: 'Курс 2' },
  { number: 3, name: 'Курс 3' }
];

document.addEventListener('DOMContentLoaded', function() {
  renderPreparationPlaces();
  renderCourses();

  const franchiseCheckbox = document.getElementById('isFranchiseNetwork');
  const royaltyGroup = document.getElementById('royaltyGroup');

  franchiseCheckbox.addEventListener('change', function() {
    royaltyGroup.style.display = this.checked ? 'block' : 'none';
  });
});

function renderPreparationPlaces() {
  const container = document.getElementById('preparationPlacesList');
  container.innerHTML = '';

  preparationPlaces.forEach((place, index) => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <input
        type="text"
        class="item-input"
        value="${place}"
        onchange="updatePreparationPlace(${index}, this.value)">
      <button
        type="button"
        class="delete-btn"
        onclick="removePreparationPlace(${index})"
        title="Удалить">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    `;
    container.appendChild(div);
  });
}

function renderCourses() {
  const container = document.getElementById('coursesList');
  container.innerHTML = '';

  courses.forEach((course, index) => {
    const div = document.createElement('div');
    div.className = 'list-item course-item';
    div.innerHTML = `
      <input
        type="text"
        class="item-input course-number"
        value="${course.number}"
        readonly>
      <input
        type="text"
        class="item-input course-name"
        value="${course.name}"
        onchange="updateCourse(${index}, this.value)">
      <button
        type="button"
        class="delete-btn"
        onclick="removeCourse(${index})"
        title="Удалить">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    `;
    container.appendChild(div);
  });
}

function addPreparationPlace() {
  preparationPlaces.push('');
  renderPreparationPlaces();
}

function removePreparationPlace(index) {
  preparationPlaces.splice(index, 1);
  renderPreparationPlaces();
}

function updatePreparationPlace(index, value) {
  preparationPlaces[index] = value;
}

function addCourse() {
  const nextNumber = courses.length > 0
    ? Math.max(...courses.map(c => c.number)) + 1
    : 0;
  courses.push({ number: nextNumber, name: '' });
  renderCourses();
}

function removeCourse(index) {
  courses.splice(index, 1);
  renderCourses();
}

function updateCourse(index, value) {
  courses[index].name = value;
}

function saveCorporation() {
  const formData = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    uid: document.getElementById('uid').value,
    directorName: document.getElementById('directorName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    inn: document.getElementById('inn').value,
    kpp: document.getElementById('kpp').value,
    isFranchiseNetwork: document.getElementById('isFranchiseNetwork').checked,
    defaultRoyalty: document.getElementById('defaultRoyalty').value,
    currency: document.getElementById('currency').value,
    preparationPlaces: preparationPlaces,
    courses: courses
  };

  console.log('Сохранение настроек корпорации:', formData);
  alert('Настройки корпорации сохранены!');
}
