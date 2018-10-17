
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
    '~/plugins/vee-validate.js'
  ],
  css: [
    '~/assets/style/app.styl'
  ],
  // axios: {
  //   proxy: true // Can be also an object with default options
  // },
  // proxy: {
  //   '/api/': 'http://api.example.com',
  //   '/api2/': 'http://api.another-website.com'
  // },
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
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
