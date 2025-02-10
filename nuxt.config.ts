import process from 'node:process'
import { createResolver } from '@nuxt/kit'
import { execaSync } from 'execa'
import pkg from './package.json'

const commit = execaSync('git', ['rev-parse', '--short', 'HEAD'])

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  // https://nuxt.com/modules
  modules: [
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@nuxthub/core',
    '@nuxt/eslint',
    'nuxt-fathom',
    '@formkit/auto-animate/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    'nuxt-auth-utils',
    '@kgierke/nuxt-basic-auth',
    'motion-v/nuxt',
    // 'nuxt-component-meta',
    // 'nuxt-og-image',
    // (_, nuxt) => {
    //   nuxt.hook('components:dirs', (dirs) => {
    //     dirs.unshift({
    //       path: resolve('./app/components/content/examples'),
    //       pathPrefix: false,
    //       prefix: '',
    //       global: true,
    //     })
    //   })
    // },
    // '~~/modules/llms/module',

    // '@nuxtjs/mdc',
    // '@nuxtjs/plausible',
    // '@vue-email/nuxt',
    // 'nuxt-mail',
  ],

  plugins: [
    {
      src: '~/plugins/jquery.client.ts',
      mode: 'client',
    },
  ],

  ssr: false,

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Docs',
      titleTemplate: '%s - Docs',

      // LemonSqueezy affiliate
      // script: [{
      //   key: 'lmsqueezy-config',
      //   innerHTML: 'window.lemonSqueezyAffiliateConfig = { store: "nuxt" };',
      // }, {
      //   key: 'lmsqueezy',
      //   src: 'https://lmsqueezy.com/affiliate.js',
      //   defer: true,
      // }],

      link: [
        { rel: 'icon', href: '/favicon.svg', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon-dark.svg' },
      ],
    },
    rootAttrs: {
      'vaul-drawer-wrapper': '',
      'class': 'bg-(--ui-bg)',
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  css: [
    '~/assets/css/fonts/index.css',
    '~/assets/css/main.css',
    'animate.css',
  ],

  // site: {
  //   url: 'https://hub.designcoder.net',
  // },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            light: 'material-theme-lighter',
            default: 'material-theme',
            dark: 'material-theme-palenight',
          },
          langs: [
            'astro',
            'bash',
            'blade',
            'csharp',
            'css',
            'csv',
            'diff',
            'handlebars',
            'http',
            'java',
            'json',
            'mdc',
            'mdx',
            'postcss',
            'python',
            'razor',
            'regex',
            'ruby',
            'sql',
            'svelte',
            'typescript',
            'vue',
            'xml',
            'yml',
          ],
        },
      },
    },

  },

  // mdc: {
  //   highlight: {
  //     noApiRoute: false,
  //   },
  // },

  ui: {
    fonts: false,
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'],
    },
  },

  appConfig: {
    buildDate: new Date().toISOString(),
  },

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    mailer: {
      host: process.env.NUXT_MAILER_HOST,
      port: process.env.NUXT_MAILER_PORT,
      user: process.env.NUXT_MAILER_USER,
      password: process.env.NUXT_MAILER_PASSWORD,
    },
    resend: {
      apiKey: '',
    },
    public: {
      version: pkg.version,
      googleApiKey: process.env.NUXT_GOOGLE_API_KEY || '',
    },
  },

  routeRules: {
    // '/': { redirect: '/guide', prerender: false },
    // '/components': { redirect: '/components/app', prerender: false },
    '/guide/installation': { redirect: '/guide/installation/nuxt', prerender: false },
    '/guide/icons': { redirect: '/guide/icons/nuxt', prerender: false },
    '/guide/color-mode': { redirect: '/guide/color-mode/nuxt', prerender: false },
    '/composables': { redirect: '/composables/define-shortcuts', prerender: false },
  },

  devServer: {
    port: 3211,
    cors: {
      origin: [
        'http://localhost:3211',
        'https://custom-origin.com',
      ],
    },
  },
  // https://nuxt.com/docs/guide/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },

  features: {
    inlineStyles: false,
  },

  experimental: {
    viewTransition: true,
  },

  compatibilityDate: '2024-07-30',

  nitro: {
    experimental: {
      openAPI: true,
    },

    prerender: {
      routes: [
        '/guide',
        '/api/countries.json',
        '/api/locales.json',
        // '/api/releases.json',
        // '/api/pulls.json'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false,
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: [
            '/components/*',
            '/guide/*',
            '/composables/*',
          ],
        },
      },
    },
  },

  // https://hub.nuxt.com/docs/guide/installation#options
  hub: {
    ai: true,
    blob: true,
    cache: true,
    // database: true,
  },

  vite: {
    define: {
      __COMMIT__: JSON.stringify(commit),
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      __USE_DEVTOOLS__: true,
      __TEST__: false,
    },
  },

  telemetry: false,

  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter(c => ['UBadge', 'UButton', 'UIcon'].includes(c.pascalName))

      globals.forEach(c => c.global = true)
    },

    // 'components:dirs': function (dirs) {
    //   dirs.push({
    //     path: '~/app-components',
    //     prefix: 'App',
    //   })
    // },

    // 'components:extend': function (components) {
    //   for (const component of components) {
    //     if (component.global)
    //       component.global = 'sync'
    //   }
    // },

    // 'pages:extend': function (routes) {
    //   console.log(JSON.stringify(routes, null, 2))
    // },
  },

  basicAuth: {
    enabled: process.env.NODE_ENV === 'production',
    allowedRoutes: ['/api/_hub/'],
    users: [
      {
        username: process.env.USERNAME || 'admin',
        password: process.env.PASSWORD || 'admin',
      },
    ],
  },

  // componentMeta: {
  //   exclude: [
  //     '@nuxt/content',
  //     '@nuxt/icon',
  //     '@nuxt/image',
  //     '@nuxtjs/color-mode',
  //     '@nuxtjs/plausible',
  //     '@kgierke/nuxt-basic-auth',
  //     'nuxt/dist',
  //     'nuxt-og-image',
  //     'nuxt-fathom',
  //     '@formkit/auto-animate/nuxt',
  //     '@vueuse/nuxt',
  //     // '@nuxtjs/mdc',
  //     // '@pinia/nuxt',
  //     // '@pinia/colada-nuxt',
  //     // 'nuxt-auth-utils',

  //     resolve('./app/components'),
  //     process.env.NUXT_UI_PRO_PATH ? resolve(process.env.NUXT_UI_PRO_PATH, 'docs', 'app', 'components') : '.c12',
  //   ],
  //   metaFields: {
  //     type: false,
  //     props: true,
  //     slots: true,
  //     events: true,
  //     exposed: false,
  //   },
  // },

  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },

  fathom: {
    siteId: 'OVDPOLBF',
  },

  icon: {
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
      {
        prefix: 'design',
        dir: './app/assets/icons/design',
      },
      {
        prefix: 'skyrizi',
        dir: './app/assets/icons/skyrizi',
      },
    ],

    clientBundle: {
      sizeLimitKb: 2048,
    },

    serverBundle: {
      collections: ['ph'],
    },
  },

  uiPro: {
    license: process.env.NUXT_UI_PRO_LICENSE, // import.meta.env.NUXT_UI_PRO_LICENSE,
  },
})
