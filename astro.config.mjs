// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
    site: 'https://poojakhanal.com.np',
    integrations: [mdx(), sitemap(), react(), tailwind({
        applyBaseStyles: false,
    }), alpinejs()],
});