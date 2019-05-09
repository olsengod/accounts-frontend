import axios from 'axios'

const httpCfg = require('@/config/http')[process.env.IS_DEV ? 'is_dev' : 'is_prod']

export default async function (store, router) {
  try {
    let signoutResponse = await axios({
      method: 'post',
      url: httpCfg.backendURL + '/api/v1/users/signout',
      headers: {'authorization': store.getters['user/accessToken']},
      validateStatus: function (status) {
        return status === 200
      }
    })

    if (signoutResponse.status === 200) {
      store.commit('user/RESET_USER')
      router.push('/signin')
      return
    }
    router.push('/signin')
  } catch (error) {
    console.log(error)
    router.push('/signin')
  }
}
