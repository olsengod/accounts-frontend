import ls from 'local-storage'
import axios from 'axios'
import errors from '../config/errors'
import httpCfg from '../config/http'

export default function ({ store, redirect }) {
  if (!store.getters['user/isAuthenticated']) {
    let accessToken = ls.get('cererisAccountAccessToken')
    console.log(accessToken)
    if (accessToken) {
      axios({
        method: 'post',
        url: httpCfg.backendURL + '/api/v1/tokens/check-access-token',
        headers: {'authorization': accessToken}
      }).then(response => {
        console.log('RESPONSE', response)
        if (response.status === 400 && response.data === [errors.ACCESS_TOKEN_EXPIRED]) {
          // Time to refresh tokens
        }
      }).catch(error => {
        console.log('ERROR', error)
      })
    }
    return redirect('/signin')
  }
}
