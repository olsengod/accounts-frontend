module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'accounts-frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Frontend for cereris accounts service' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      // { rel: 'stylesheet', href: '@/assets/font-awesome/css/all.css' }
    ]
  },
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/i18n.js',
    '~/plugins/vee-validate.js',
    '~/plugins/querystring.js'
  ],
  css: [
    '~/assets/style/app.styl'
  ],
  transition: {
    name: 'page',
    mode: 'out-in'
  },
  layoutTransition: {
    name: 'layout',
    mode: 'out-in'
  },
  // axios: {
  //   proxy: true // Can be also an object with default options
  // },
  // proxy: {
  //   '/api/': 'http://api.example.com',
  //   '/api2/': 'http://api.another-website.com'
  // },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With',
      'Content-Security-Policy':      "default-src 'unsafe-inline' *",
      'X-Content-Security-Policy':    "default-src 'unsafe-inline' *",
      'X-WebKit-CSP':                 "default-src 'unsafe-inline' *"
    }
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  mode: 'spa',
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      '~/plugins/vuetify.js',
      'axios',
      'jsonwebtoken',
      'local-storage',
      'sha256'
    ],
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.d
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  env: {
    IS_DEV: (process.env.IS_DEV === 'false') ? '' : true
  }
}
