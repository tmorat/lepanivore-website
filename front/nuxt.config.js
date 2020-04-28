import colors from 'vuetify/es5/util/colors';

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Boulangerie Le Panivore',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ff3300' },
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/index.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~/plugins/api-service.plugin' }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/toast',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
    /**
     * baseURL is used in SSR mode and will be overridden if API_URL environment variable if present
     */
    baseURL: 'http://localhost:3001/',
    /**
     * browserBaseURL is used in client browser and will be proxified if API_URL environment variable is present (see proxy configuration below)
     */
    browserBaseURL: '/',
  },
  proxy: {
    /**
     * Configure proxy to dynamically route /api/** requests to API_URL if present
     */
    '/api': { target: process.env.API_URL || 'http://localhost:3001' },
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/authentication/login', method: 'post', propertyName: 'accessToken' },
          user: { url: '/api/authentication/profile', method: 'get', propertyName: false },
          logout: false,
        },
      },
    },
    redirect: {
      login: '/admin/connexion',
      home: '/admin/commandes',
    },
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
    // theme: {
    //   dark: true,
    //   themes: {
    //     dark: {
    //       primary: colors.blue.darken2,
    //       accent: colors.grey.darken3,
    //       secondary: colors.amber.darken3,
    //       info: colors.teal.lighten1,
    //       warning: colors.amber.base,
    //       error: colors.deepOrange.accent4,
    //       success: colors.green.accent3,
    //     },
    //   },
    // },
  },
  toast: {
    position: 'top-center',
    duration: 30000,
    iconPack: 'mdi',
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // extend(config, ctx) {}
    loaders: {
      scss: { sourceMap: false },
    },
  },
  server: {
    port: process.env.PORT || 3000, // default: 3000
    host: process.env.HOST || 'localhost', // default: localhost
  },
  ignore: ['**/*.spec.*'],
};
