let currentColorScheme = localStorage.getItem('colorScheme');
if (currentColorScheme !== 'system' && currentColorScheme !== 'light' && currentColorScheme !== 'dark')
    currentColorScheme = 'system';
const setColorScheme = function (scheme) {
    switch (scheme) {
        case 'system':
            document.documentElement.removeAttribute('data-tide-color-scheme');
            currentColorScheme = 'system';
            localStorage.setItem('colorScheme', 'system');
            break;
        case 'light':
            document.documentElement.setAttribute('data-tide-color-scheme', 'light');
            currentColorScheme = 'light';
            localStorage.setItem('colorScheme', 'light');
            break;
        case 'dark':
            document.documentElement.setAttribute('data-tide-color-scheme', 'dark');
            currentColorScheme = 'dark';
            localStorage.setItem('colorScheme', 'dark');
            break;
    }
};
setColorScheme(currentColorScheme);
