function setGetMoreContact(langKey) {
    const siteKey = '0x4AAAAAAA-idJ17jPKiR-lf';
    const getMoreContact = document.getElementById('get-more-contact');
    const turnstileContainer = document.getElementById('turnstile-container');
    if (getMoreContact && turnstileContainer) {
        let turnstileLoaded = false;
        getMoreContact.addEventListener('click', function () {
            if (turnstileLoaded) return;
            turnstile.render(turnstileContainer, {
                sitekey: siteKey,
                language: langKey,
                callback: function (token) {
                    fetch('https://service.yukun.bio/get-more-contact', { method: 'POST', body: JSON.stringify({ turnstileToken: token }) }).then(async function (response) {
                        if (!response.ok) console.error(`Unable to get more contact: Server returned status ${response.status} with data ${JSON.stringify(response.json())}.`);
                        const moreContactContainer = document.getElementById('more-contact-container');
                        if (!moreContactContainer) return;
                        const res = await response.json();
                        if (res.code !== 0) console.error(`Unable to get more contact: Server returned data ${JSON.stringify(response.json())}.`);
                        moreContactContainer.innerHTML = marked.parse(res.data[langKey]);
                        turnstile.remove();
                        turnstileContainer.style.display = 'none';
                    }).catch(function (error) {
                        throw console.error(`Unable to get more contact: Request failed with error ${error}.`);
                    });
                }
            });
            turnstileLoaded = true;
        });
    }
}

function variousFix() {
    // 修复移动端网易云音乐外链。
    if (!!navigator.userAgent.match(
        /(phone|pad|pod|Mobile|iPhone|iPad|iPod|ios|Android|Windows Phone|Symbian|BlackBerry|WebOS|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG)/i
    )) {
        [...document.getElementsByTagName('iframe')].forEach(element => {
            if (element.src.includes('music.163.com/'))
                element.src = element.src.replace('music.163.com/', 'music.163.com/m/');
        });
    }
}

let initPswp;

function updateInterface(langKey) {
    const langContent = content[langKey];
    document.documentElement.setAttribute('lang', langKey);
    document.documentElement.setAttribute('dir', langContent.dir);
    const profile = document.getElementById('profile');
    profile.setAttribute('src', langContent.profiles[0].src);
    profile.setAttribute('alt', langContent.profiles[0].alt);
    profile.style.cursor = 'zoom-in';
    const psOptions = {
        dataSource: langContent.profiles
    };
    Object.assign(psOptions, langContent.photoSwipe);
    if (initPswp)
        profile.removeEventListener('click', initPswp);
    initPswp = function () {
        const pswp = new PhotoSwipe(psOptions);
        pswp.init();
    };
    profile.addEventListener('click', initPswp);
    document.getElementById('name').textContent = document.title = langContent.name;
    document.getElementById('desc').textContent = langContent.desc;
    const links = document.getElementById('links');
    links.innerHTML = '';
    for (const link of langContent.links) {
        const iconWrapper = document.createElement('span');
        iconWrapper.setAttribute('class', 'icon-wrapper');
        const newLink = document.createElement('a');
        newLink.title = link.title;
        newLink.setAttribute('class', `icon un-i-${link.icon}`);
        newLink.href = link.href;
        newLink.target = '_blank';
        newLink.rel = 'noopener';
        iconWrapper.append(newLink);
        links.append(iconWrapper);
    }
    document.querySelector('label[for="select-color-scheme"]').textContent = langContent.colorScheme.label;
    document.querySelectorAll('#select-color-scheme option').forEach(el => {
        el.textContent = langContent.colorScheme[el.value];
    });
    document.querySelector('label[for="select-lang"]').textContent = langContent.langLabel;
    document.getElementById('rendered-content').innerHTML = marked.parse(langContent.markdown);
    setGetMoreContact(langKey);
    variousFix();
}

function domContentLoadedHandler(eDomContentLoaded) {
    let currentLang;
    const url = new URL(window.location.href);
    const langs = [url.searchParams.get('lang'), localStorage.getItem('lang'), ...navigator.languages];
    for (const lang of langs) {
        if (!lang) continue;
        if (lang in content) {
            currentLang = lang;
            break;
        } else if (lang.startsWith('zh')) {
            currentLang = 'zh-CN';
            break;
        }
    }
    if (!currentLang)
        currentLang = 'en';
    window.history.replaceState(null, null, window.location.protocol + '//' + window.location.host + window.location.pathname);
    const langSelect = document.getElementById('select-lang');
    for (const key of Object.keys(content)) {
        let option = document.createElement('option');
        option.value = key;
        option.textContent = content[key].langName;
        langSelect.append(option);
    }
    langSelect.value = currentLang;
    langSelect.addEventListener('change', function (e) {
        localStorage.setItem('lang', e.target.value);
        updateInterface(e.target.value);
    });
    localStorage.setItem('lang', currentLang);
    updateInterface(currentLang);
    let currentColorScheme = localStorage.getItem('colorScheme');
    if (currentColorScheme !== 'system' && currentColorScheme !== 'light' && currentColorScheme !== 'dark')
        currentColorScheme = 'system';
    const setColorScheme = function (scheme) {
        switch (scheme) {
            case 'system':
                document.documentElement.removeAttribute('data-color-scheme');
                currentColorScheme = 'system';
                localStorage.setItem('colorScheme', 'system');
                break;
            case 'light':
                document.documentElement.setAttribute('data-color-scheme', 'light');
                currentColorScheme = 'light';
                localStorage.setItem('colorScheme', 'light');
                break;
            case 'dark':
                document.documentElement.setAttribute('data-color-scheme', 'dark');
                currentColorScheme = 'dark';
                localStorage.setItem('colorScheme', 'dark');
                break;
        }
    };
    setColorScheme(currentColorScheme);
    document.getElementById('select-color-scheme').value = currentColorScheme;
    document.getElementById('select-color-scheme').addEventListener('change', function (e) {
        setColorScheme(e.target.value);
    });
    document.getElementById('loading').style.display = 'none';
}

if (document.readyState !== 'loading')
    domContentLoadedHandler();
else
    document.addEventListener('DOMContentLoaded', domContentLoadedHandler);
