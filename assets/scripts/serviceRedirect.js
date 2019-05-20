import axios from 'axios'

const httpCfg = require('@/config/http')[process.env.IS_DEV ? 'is_dev' : 'is_prod']

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
