import axios from 'axios'
import httpCfg from '@/config/http'

export default async function (refreshToken, prevURL) {
  try {
    let generateResponse = await axios({
      method: 'post',
      url: httpCfg.backendURL + '/api/v1/tokens/generate',
      data: { refreshToken },
      validateStatus: function (status) {
        return status === 200 || status === 400
      }
    })

    if (generateResponse.status === 200) {
      if (prevURL.search(/http:\/\/localhost:3000\//i) === 0) {
        window.location.href = 'http://localhost:3000' + '?refreshToken=' + generateResponse.data.data.refreshToken
        return
      }
      return
    }
    console.log('Generate error', generateResponse.data.data)
  } catch (error) {
    console.log(error)
  }
}
