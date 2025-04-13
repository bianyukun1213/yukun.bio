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
                    fetch('https://service.yukun.bio/get-more-contact', { method: 'POST', body: JSON.stringify({ turnstileToken: token, source }) }).then(async function (response) {
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

let hideImgLoading;
let showImgError;
let initPswp;

function updateInterface(langKey) {
    const langContent = content[langKey];
    document.documentElement.setAttribute('lang', langKey);
    document.documentElement.setAttribute('dir', langContent.dir);
    document.getElementById('name').textContent = document.title = langContent.name;
    document.getElementById('desc').textContent = langContent.desc;
    const links = document.getElementById('links');
    links.innerHTML = '';
    for (const link of langContent.links) {
        let iconWrapper = document.createElement('span');
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
    /** render markdown */
    document.getElementById('rendered-content').innerHTML = marked.parse(langContent.markdown);
    const imgs = [...document.getElementsByTagName('img')];
    imgs.forEach(function (img) {
        img.className += ' img-loading';
    });
    hideImgLoading = function (e) {
        let loadedImg = e.target;
        loadedImg.className = loadedImg.className.replace(' img-loading', '');
        loadedImg.style.aspectRatio = null;
    };
    showImgError = function (e) {
        let loadedImg = e.target;
        loadedImg.removeAttribute('tabindex');
        loadedImg.className = loadedImg.className.replace(' img-loading', '') + ' img-error';
    };
    const profile = document.getElementById('profile');
    if (hideImgLoading) profile.removeEventListener('load', hideImgLoading);
    if (showImgError) profile.removeEventListener('error', showImgError);
    profile.addEventListener('load', hideImgLoading);
    profile.addEventListener('error', showImgError);
    profile.style.aspectRatio = langContent.profiles[0].width / langContent.profiles[0].height;
    profile.setAttribute('src', langContent.profiles[0].src);
    profile.setAttribute('alt', langContent.profiles[0].alt);
    if (initPswp) {
        profile.removeEventListener('click', initPswp);
        profile.removeEventListener('keydown', initPswp);
    }
    initPswp = function (e) {
        if (e.target.className.includes('img-error')) return;
        if (e.type === 'click' || e.type === 'keydown' && e.key === 'Enter') {
            e.preventDefault();
            const psOptions = {
                dataSource: langContent.profiles
            };
            Object.assign(psOptions, langContent.photoSwipe);
            const pswp = new PhotoSwipe(psOptions);
            pswp.init();
        }
    };
    profile.addEventListener('click', initPswp);
    profile.addEventListener('keydown', initPswp);
    const profileImgCounter = document.getElementById('profile-img-counter');
    profileImgCounter.title = langContent.profileImgCounterTitle;
    profileImgCounter.innerHTML = '<span class="icon un-i-uil:images un-me-1"></span>' + langContent.profiles.length;
    if (langContent.profiles.length > 1)
        profileImgCounter.style.display = 'block';
    const renderedImgs = [...document.querySelectorAll('#rendered-content img[data-width][data-height]')];
    if (renderedImgs.length > 0) {
        renderedImgs.forEach(function (img) {
            img.style.aspectRatio = img.getAttribute('data-width') / img.getAttribute('data-height');
            const initPswpRendered = function (e) {
                if (e.target.className.includes('img-error')) return;
                if (e.type === 'click' || e.type === 'keydown' && e.key === 'Enter') {
                    e.preventDefault();
                    const imgIndex = renderedImgs.indexOf(e.target);
                    if (imgIndex !== -1) {
                        const psRenderedOptions = {
                            dataSource: renderedImgs.filter(i => !i.className.includes('img-error')).map(i => { return { src: i.src, width: i.getAttribute('data-width'), height: i.getAttribute('data-height'), alt: i.alt }; }),
                            index: imgIndex
                        };
                        Object.assign(psRenderedOptions, langContent.photoSwipe);
                        const pswpRendered = new PhotoSwipe(psRenderedOptions);
                        pswpRendered.init();
                    }
                }
            };
            img.addEventListener('load', hideImgLoading);
            img.addEventListener('error', showImgError);
            img.addEventListener('click', initPswpRendered);
            img.addEventListener('keydown', initPswpRendered);
        });
    }
    setGetMoreContact(langKey);
    variousFix();
}

let source;

function domContentLoadedHandler(eDomContentLoaded) {
    let currentLang;
    const url = new URL(window.location.href);
    const langs = [url.searchParams.get('lang'), localStorage.getItem('lang'), ...navigator.languages];
    source = url.searchParams.get('s') ?? '';
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
    let newUrl = url.origin + url.pathname;
    url.searchParams.delete('lang');
    let qs = url.searchParams.toString();
    if (qs) newUrl += '?' + qs;
    window.history.replaceState(null, null, newUrl);
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
