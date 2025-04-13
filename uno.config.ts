// uno.config.ts
import { defineConfig, presetUno, presetTypography, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
    content: {
        filesystem: ['./index.html']
    },
    preflights: [],
    presets: [
        presetUno({ prefix: 'un-' }),
        presetIcons({
            prefix: 'un-i-',
            collections: {
                uil: () => import('@iconify-json/uil').then((i) => i.icons as any),
                'simple-icons': () => import('@iconify-json/simple-icons').then((i) => i.icons as any)
            },
            extraProperties: {
                display: 'inline-block',
                'vertical-align': 'middle'
            }
        })
    ],
    shortcuts: {
        'un-sc-clearfix': 'after:un-clear-both after:un-content-empty after:un-block',
        'un-sc-trans-default': 'motion-safe:(un-transition-all un-ease-in-out un-duration-200)',
        'un-sc-link-default': 'un-underline link:un-text-lk hover:(un-underline-offset-4 un-text-lk-hvr) visited:un-text-lk-vst',
        'un-sc-link-plain': 'un-decoration-transparent hover:(un-decoration-current) un-text-txt-prim',
        'un-sc-btn-default': 'un-bg-bg-prim un-sc-trans-default un-flex un-items-center un-justify-center un-text-prim un-border-(2 prim solid) hover:un-scale-110 active:un-scale-90 un-cursor-pointer disabled:(un-opacity-50 un-cursor-not-allowed hover:un-transform-none active:un-transform-none)',
        'un-sc-btn-plain': 'un-bg-bg-prim un-sc-trans-default un-flex un-items-center un-justify-center un-text-txt-prim un-border-(2 txt-prim solid) hover:un-scale-110 active:un-scale-90 un-cursor-pointer disabled:(un-opacity-50 un-cursor-not-allowed hover:un-transform-none active:un-transform-none)',
        'un-sc-dlg-fullscreen': 'un-bg-transparent un-absolute un-w-full un-max-w-full un-h-full un-max-h-full un-p-0 un-m-0 un-z-100 un-border-none',
        'un-sc-dlg-mask': 'un-bg-black/75 un-absolute un-w-full un-h-full',
        'un-sc-select-default': 'un-bg-bg-prim un-text-txt-prim un-border-(2 prim solid) disabled:(un-opacity-50 un-cursor-not-allowed)',
        'un-sc-select-plain': 'un-bg-bg-prim un-text-txt-prim un-border-(2 txt-prim solid) disabled:(un-opacity-50 un-cursor-not-allowed)',
        'un-sc-input-default': 'un-bg-bg-prim un-text-txt-prim un-border-(2 prim solid) disabled:(un-opacity-50 un-cursor-not-allowed)',
        'un-sc-input-plain': 'un-bg-bg-prim un-text-txt-prim un-border-(2 txt-prim solid) disabled:(un-opacity-50 un-cursor-not-allowed)'
    },
    transformers: [
        transformerDirectives(),
        // transformerVariantGroup() // 有前缀的情况下似乎无法生效。
    ],
    theme: {
        colors: {
            'prim': 'var(--tide-color-primary)',
            'scnd': 'var(--tide-color-secondary)',
            'bgPrim': 'var(--tide-color-background-primary)',
            'bgScnd': 'var(--tide-color-background-secondary)',
            'bgSb': 'var(--tide-color-background-side-bar)',
            'txtPrim': 'var(--tide-color-text-primary)',
            'txtScnd': 'var(--tide-color-text-secondary)',
            'txtDmsh': 'var(--tide-color-text-diminished)',
            'txtSb': 'var(--tide-color-text-side-bar)',
            'fcsOl': 'var(--tide-color-focused-outline)',
            'lk': 'var(--tide-color-link)',
            'lkHvr': 'var(--tide-color-link-hover)',
            'lkVst': 'var(--tide-color-link-visited)',
            'code': 'var(--tide-color-code)',
            'tbBd': 'var(--tide-color-table-border)',
            'tbBgHd': 'var(--tide-color-table-border-head)',
            'tbBgEvn': 'var(--tide-color-table-border-even)',
        }
    },
    safelist: [
        'un-i-uil:images',
        'un-me-1',
        'un-i-uil:globe',
        'un-i-simple-icons:github',
        'un-i-simple-icons:mastodon',
        'un-i-simple-icons:instagram',
        'un-i-simple-icons:vk',
        'un-i-simple-icons:steam'
    ]
});
