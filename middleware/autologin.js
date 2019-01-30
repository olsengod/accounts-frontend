import ls from 'local-storage'
// import {accountsStorage} from '@/plugins/local-storage'

export default async function ({ query }) {
  if ('accessToken' in query && 'refreshToken' in query && 'expiresIn' in query) {
    ls.set('cererisAccountAccessToken', query.accessToken)
    ls.set('cererisAccountRefreshToken', query.refreshToken)
    ls.set('cererisExpiresIn', query.expiresIn)
    // accountsStorage.set('cererisAccountAccessToken', query.accessToken, (error, data) => {
    //   console.log('SET', error)
    //   accountsStorage.set('cererisAccountRefreshToken', query.refreshToken, (error, data) => {
    //     console.log('SET', error)
    //     accountsStorage.set('cererisExpiresIn', query.expiresIn, (error, data) => {
    //       console.log('SET', error)
    //     })
    //   })
    // })
  }
}
