module.exports = {
  is_prod: {
    backendURL: 'https://accounts.cereris.org',
    torlightFrontendURL: process.env.IS_LOCAL ? 'http://localhost:3000' : 'https://torlight-app.cereris.org',
    regexTorlightFrontendURL: process.env.IS_LOCAL ? /http:\/\/localhost:3000\//i : /https:\/\/torlight-app.cereris.org\//i
  },
  is_dev: {
    backendURL: 'https://accounts-dev.cereris.org',
    torlightFrontendURL: process.env.IS_LOCAL ? 'http://localhost:3000' : 'https://torlight-app-stage.cereris.org',
    regexTorlightFrontendURL: process.env.IS_LOCAL ? /http:\/\/localhost:3000\//i : /https:\/\/torlight-app-stage.cereris.org\//i
  }
}
