import ls from 'local-storage'
import axios from 'axios'
import errors from '../config/errors'
import httpCfg from '../config/http'
import userCfg from '../config/user'

export default async function ({ app, store, redirect }) {
  try {
    if (store.getters['user/isAuthenticated']) {
      return
    }
    // console.log(app)
    let accessToken = ls.get('cererisAccountAccessToken')
    let refreshToken = ls.get('cererisAccountRefreshToken')
    let expiresIn = ls.get('cererisExpiresIn')
    if (!accessToken || !refreshToken || !expiresIn) {
      // console.log('FIRST REDIRECT')
      return redirect('/signin')
    }

    let tokenResponse
    let userResponse

    tokenResponse = await axios({
      method: 'post',
      url: httpCfg.backendURL + '/api/v1/tokens/check-access-token',
      headers: {'authorization': accessToken},
      validateStatus: function (status) {
        return status === 200 || status === 400
      }
    })

    if (tokenResponse.status === 200) {
      userResponse = await axios({
        method: 'get',
        url: httpCfg.backendURL + '/api/v1/users/current',
        headers: {'authorization': accessToken},
        validateStatus: function (status) {
          return status === 200
        }
      })
      store.dispatch('user/setTokens', { data: {
        accessToken,
        refreshToken,
        expiresIn: expiresIn,
        redirect
      }})
      store.dispatch('user/setUser', { data: userResponse.data.data, i18n: app.i18n })
      if (userResponse.data.data.state === userCfg.states.ACTIVE) {
        store.commit('user/SET_IS_AUTHENTICATED', true)
      }
      return
    }

    if (tokenResponse.status === 400 && JSON.stringify(tokenResponse.data.data) === JSON.stringify([errors.ACCESS_TOKEN_EXPIRED])) {
      tokenResponse = await axios({
        method: 'post',
        url: httpCfg.backendURL + '/api/v1/tokens/refresh',
        data: { refreshToken },
        validateStatus: function (status) {
          return status === 200 || status === 400
        }
      })

      userResponse = await axios({
        method: 'get',
        url: httpCfg.backendURL + '/api/v1/users/current',
        headers: {'authorization': tokenResponse.data.data.accessToken},
        validateStatus: function (status) {
          return status === 200
        }
      })

      tokenResponse.data.data.redirect = redirect
      store.dispatch('user/setTokens', { data: tokenResponse.data.data })
      store.dispatch('user/setUser', { data: userResponse.data.data, i18n: app.i18n })
      if (userResponse.data.data.state === userCfg.states.ACTIVE) {
        store.commit('user/SET_IS_AUTHENTICATED', true)
      }
      return
    }
    // console.log('LAST REDIRECT')
    redirect('/signin')
  } catch (err) {
    // console.log(err)
    redirect('/signin')
  }
}
