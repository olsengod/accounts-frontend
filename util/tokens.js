import axios from 'axios'
import httpCfg from '../config/http'

export async function refreshTokens (refreshToken, store) {
  let response = await axios({
    method: 'post',
    url: httpCfg.backendURL + '/api/v1/tokens/refresh',
    data: { refreshToken },
    validateStatus: function (status) {
      return status === 200
    }
  })
  store.dispatch('user/setTokens', { data: response.data })
}
