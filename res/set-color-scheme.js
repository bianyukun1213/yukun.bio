let currentColorScheme = localStorage.getItem('colorScheme');
if (currentColorScheme !== 'system' && currentColorScheme !== 'light' && currentColorScheme !== 'dark')
    currentColorScheme = 'system';
const setColorScheme = function (scheme) {
    switch (scheme) {
        case 'system':
            delete document.documentElement.dataset.colorScheme;
            currentColorScheme = 'system';
            localStorage.setItem('colorScheme', 'system');
            break;
        case 'light':
            document.documentElement.dataset.colorScheme =  'light';
            currentColorScheme = 'light';
            localStorage.setItem('colorScheme', 'light');
            break;
        case 'dark':
            document.documentElement.dataset.colorScheme =  'dark';
            currentColorScheme = 'dark';
            localStorage.setItem('colorScheme', 'dark');
            break;
    }
};
setColorScheme(currentColorScheme);
