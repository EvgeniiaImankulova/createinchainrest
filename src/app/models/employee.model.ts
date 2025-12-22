export interface Employee {
  id?: string;
  first_name: string;
  last_name: string;
  patronymic?: string;
  system_name?: string;
  phone?: string;
  email?: string;
  position?: string;
  created_at?: string;
  updated_at?: string;
}

export function createEmptyEmployee(): Employee {
  return {
    first_name: '',
    last_name: '',
    system_name: '',
    phone: '',
    email: '',
    position: ''
  };
}

export function getEmployeeFullName(employee: Employee): string {
  const parts = [employee.last_name, employee.first_name];
  if (employee.patronymic) {
    parts.push(employee.patronymic);
  }
  return parts.join(' ');
}
