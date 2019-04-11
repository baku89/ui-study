export default interface MenuItem {
    value: string | number | symbol;
    label: string;
    shortLabel?: string;
    icon?: string;
    type?: 'submenu' | 'compact';
    submenu?: MenuItem[];
}
