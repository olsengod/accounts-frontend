module.exports = {
  is_prod: {
    backendURL: 'https://accounts.cereris.org'
  },
  is_dev: {
    backendURL: 'https://accounts-dev.cereris.org',
    torlightBackendURL: 'https://torlight-app-stage.cereris.org',
    regexTorlightBackendURL: /https:\/\/torlight-app-stage.cereris.org\//i
    // torlightBackendURL: 'http://localhost:3000',
    // regexTorlightBackendURL: '/http:\/\/localhost:3000\//i'
  }
}
