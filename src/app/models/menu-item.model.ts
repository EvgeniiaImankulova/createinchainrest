export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  label: string;
  route: string;
}
