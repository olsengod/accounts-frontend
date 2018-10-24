import axios from 'axios'
import httpCfg from '@/config/http'

export default async function ({ store, redirect }) {
  try {
    await axios({
      method: 'post',
      url: httpCfg.backendURL + '/api/v1/users/signout',
      headers: {'authorization': store.getters['user/accessToken']},
      validateStatus: function (status) {
        return status === 200
      }
    })

    store.commit('user/RESET_USER')
    redirect('/signin')
  } catch (error) {
    console.log(error)
    redirect('/signin')
  }
}
