import { app, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import moment from 'moment-timezone';
import { MenuItem } from './models/MenuItem';

let tray: Tray | null = null;

app.whenReady().then(() => {
    const icon = nativeImage.createFromPath(path.join(__dirname, 'src/assets/clock_icon.png'));

    tray = new Tray(icon);
    tray.setToolTip('Часы');

    function updateTrayMenu() {
        const timeInZones = [
            { zone: 'Europe/Moscow', label: 'Москва' },
            { zone: 'America/New_York', label: 'Нью-Йорк' },
            { zone: 'Asia/Tokyo', label: 'Токио' },
        ];

        const times = timeInZones.map(zone => {
            return `${zone.label}: ${moment().tz(zone.zone).format('HH:mm:ss')}`;
        });

        const menuItems: MenuItem[] = times.map(time => ({
            label: time,
            enabled: false,
        }));

        menuItems.push(
            { type: 'separator', enabled: false },
            { label: 'Выход', click: () => app.quit(), enabled: true }
        );

        const timeMenu = Menu.buildFromTemplate(menuItems);
        tray?.setContextMenu(timeMenu);
    }

    setInterval(updateTrayMenu, 1000);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Показать время',
            click: updateTrayMenu,
        },
        { label: 'Выход', click: () => app.quit() },
    ]);

    tray.setContextMenu(contextMenu);
    updateTrayMenu();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
