import ls from 'local-storage'

export default async function ({ query }) {
  if ('accessToken' in query && 'refreshToken' in query && 'expiresIn' in query) {
    ls.set('cererisAccountAccessToken', query.accessToken)
    ls.set('cererisAccountRefreshToken', query.refreshToken)
    ls.set('cererisExpiresIn', query.expiresIn)
  }
}
