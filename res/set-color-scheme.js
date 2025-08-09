let currentColorScheme = localStorage.getItem('colorScheme');
if (currentColorScheme !== 'system' && currentColorScheme !== 'light' && currentColorScheme !== 'dark')
    currentColorScheme = 'system';
const setGiscusColorScheme = function (theme) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow.postMessage({
        giscus: {
            setConfig: {
                theme: 'https://yukun.bio/res/giscus/' + theme + '.css'
            }
        }
    }, 'https://giscus.app');
}
const setColorScheme = function (scheme) {
    switch (scheme) {
        case 'system':
            delete document.documentElement.dataset.colorScheme;
            currentColorScheme = 'system';
            localStorage.setItem('colorScheme', 'system');
            setGiscusColorScheme('preferred-color-scheme');
            break;
        case 'light':
            document.documentElement.dataset.colorScheme = 'light';
            currentColorScheme = 'light';
            localStorage.setItem('colorScheme', 'light');
            setGiscusColorScheme('light');
            break;
        case 'dark':
            document.documentElement.dataset.colorScheme = 'dark';
            currentColorScheme = 'dark';
            localStorage.setItem('colorScheme', 'dark');
            setGiscusColorScheme('dark');
            break;
    }
};
setColorScheme(currentColorScheme);
