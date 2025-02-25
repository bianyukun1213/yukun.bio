const content = {
    'zh-CN': {
        langName: '简体中文',
        dir: 'ltr',
        profiles: [
            {
                src: 'https://bucket.hollisdevhub.com/blog/posts/a14d0940/imgs/1002/DSCF0266.JPG',
                width: 1080,
                height: 1920,
                alt: '112233'
            },
            {
                src: 'https://bucket.hollisdevhub.com/blog/posts/a14d0940/imgs/1002/DSCF0981.JPG',
                width: 1920,
                height: 1080,
                alt: '112233'
            }
        ],
        links: [
            {
                title: '博客',
                icon: 'uil:globe',
                href: 'https://his2nd.life/'
            },
            {
                title: 'GitHub',
                icon: 'simple-icons:github',
                href: 'https://github.com/bianyukun1213'
            },
            {
                title: '长毛象中文站',
                icon: 'simple-icons:mastodon',
                href: 'https://m.cmx.im/deck/@Hollis'
            },
            {
                title: 'Instagram',
                icon: 'simple-icons:instagram',
                href: 'Instagram',
            },
            {
                title: 'Vkontakte',
                icon: 'simple-icons:vk',
                href: 'vk'
            },
            {
                title: 'Steam',
                icon: 'simple-icons:steam',
                href: 'https://steamcommunity.com/id/heyhollis/'
            }
        ],
        name: '边宇琨',
        desc: '测试',
        markdown:
            `## 你好！
## 联系方式

<details>
<summary id="get-more-contact">获取更多</summary>
<div id="turnstile-container"></div>
<div id="more-contact-container"></div>
</details>
            `,
        photoSwipe: {
            closeTitle: '关闭',
            zoomTitle: '缩放',
            arrowPrevTitle: '上一张',
            arrowNextTitle: '下一张',
            errorMsg: '此图片无法加载',
            indexIndicatorSep: ' / ',
        }
    },
    en: {
        langName: 'English',
        dir: 'ltr',
        profiles: [
            {
                src: 'https://bucket.hollisdevhub.com/blog/posts/a14d0940/imgs/1002/DSCF0266.JPG',
                width: 1920,
                height: 1080,
                alt: '112233'
            }
        ],
        links: [
            {

            }
        ],
        name: 'Bian Yukun',
        desc: 'test',
        markdown:
            `
        ## This is not the title

        Bye, **motherfucker**!
        `,
        photoSwipe: {
            closeTitle: 'Close',
            zoomTitle: 'Zoom',
            arrowPrevTitle: 'Previous',
            arrowNextTitle: 'Next',
            errorMsg: 'The image cannot be loaded',
            indexIndicatorSep: ' / ',
        }
    }
};

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
    profile.addEventListener('click', function () {
        const pswp = new PhotoSwipe(psOptions);
        pswp.init();
    });
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
    document.getElementById('rendered-content').innerHTML = marked.parse(langContent.markdown);
    const getMoreContact = document.getElementById('get-more-contact');
    const turnstileContainer = document.getElementById('turnstile-container');
    if (getMoreContact && turnstileContainer) {
        let turnstileLoaded = false;
        getMoreContact.addEventListener('click', function () {
            if (turnstileLoaded) return;
            turnstile.render(turnstileContainer, {
                sitekey: '0x4AAAAAAA-idJ17jPKiR-lf',
                callback: function (token) {
                    fetch('https://service.yukun.bio/get-more-contact', { method: 'POST', body: JSON.stringify({ turnstileToken: token }) }).then(async function (response) {
                        if (!response.ok) console.error(`Unable to get more contact: Server returned status ${response.status} with data ${JSON.stringify(response.json())}.`);
                        // console.log(response.json());
                        const moreContactContainer = document.getElementById('more-contact-container');
                        if (!moreContactContainer) return;
                        const res = await response.json();
                        if (res.code !== 0) console.error(`Unable to get more contact: Server returned data ${JSON.stringify(response.json())}.`);
                        moreContactContainer.innerHTML = marked.parse(res.data[langKey]);
                        turnstile.remove();
                    }).catch(function (error) {
                        throw console.error(`Unable to get more contact: Request failed with error ${error}.`);
                    });
                }
            });
            turnstileLoaded = true;
        });
    }
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
    document.getElementById('loading').style.display = 'none';
}

if (document.readyState !== 'loading')
    domContentLoadedHandler();
else
    document.addEventListener('DOMContentLoaded', domContentLoadedHandler);
