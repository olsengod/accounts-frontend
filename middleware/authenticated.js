import ls from 'local-storage'
import axios from 'axios'
import errors from '../config/errors'
import httpCfg from '../config/http'
import { refreshTokens } from '../util/tokens'
import jwt from 'jsonwebtoken'

export default async function ({ store, redirect }) {
  try {
    if (store.getters['user/isAuthenticated']) {
      return
    }

    let accessToken = ls.get('cererisAccountAccessToken')
    let refreshToken = ls.get('cererisAccountRefreshToken')
    if (!accessToken || !refreshToken) {
      return redirect('/signin')
    }

    let response = await axios({
      method: 'post',
      url: httpCfg.backendURL + '/api/v1/tokens/check-access-token',
      headers: {'authorization': accessToken},
      validateStatus: function (status) {
        return status === 200 || status === 400
      }
    })

    if (response.status === 200) {
      store.dispatch('user/setTokens', { data: {
        accessToken,
        refreshToken,
        expiresIn: jwt.decode(accessToken).exp
      }})
      return
    }

    if (response.status === 400 && response.data === [errors.ACCESS_TOKEN_EXPIRED]) {
      await refreshTokens(refreshToken)
      return
    }

    redirect('/signin')
  } catch (err) {
    redirect('/signin')
  }
}
