export interface MenuItem {
    type?: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio' | undefined,
    label?: string,
    enabled: boolean,
    click?: () => void
};