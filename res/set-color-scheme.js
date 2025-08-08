let currentColorScheme = localStorage.getItem('colorScheme');
if (currentColorScheme !== 'system' && currentColorScheme !== 'light' && currentColorScheme !== 'dark')
    currentColorScheme = 'system';
const handleGiscusMessage = function (event) {
    if (event.origin !== 'https://giscus.app') return;
    if (!(typeof event.data === 'object' && event.data.giscus)) return;
    const giscusData = event.data.giscus;
    // 首次 resize 认为是加载完成。
    if (giscusData.resizeHeight && !window.giscusInited) {
        document.getElementsByClassName('giscus-frame')[0].removeAttribute('scrolling');
        let currentLang = 'en';
        if (typeof getCurrentLang === 'function')
            currentLang = getCurrentLang();
        if (typeof setGiscusLang === 'function')
            setGiscusLang(currentLang);
        const currentColorScheme = document.documentElement.dataset.colorScheme;
        if (currentColorScheme)
            setGiscusColorScheme(currentColorScheme);
        else
            setGiscusColorScheme('preferred_color_scheme');
        window.giscusInited = true;
    }
}
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
window.addEventListener('message', handleGiscusMessage);
setColorScheme(currentColorScheme);
