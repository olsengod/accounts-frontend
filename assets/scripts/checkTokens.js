import ls from 'local-storage'

export default function ({ redirect }, redirectTo) {
  try {
    let accessToken = ls.get('cererisAccountAccessToken')
    let refreshToken = ls.get('cererisAccountRefreshToken')
    let expiresIn = ls.get('cererisExpiresIn')

    if (!accessToken || !refreshToken || !expiresIn) {
      return redirect(redirectTo)
    }

    return {accessToken, refreshToken, expiresIn}
  } catch (error) {
    console.log('tokenErr ', error)
  }
}
