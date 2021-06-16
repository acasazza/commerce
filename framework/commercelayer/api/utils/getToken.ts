import Cookies from 'js-cookie'
import { getSalesChannelToken } from '@commercelayer/js-auth'

type GetTokenObj = {
  clientId?: string
  endpoint?: string
  scope?: string
}

export async function getToken({
  clientId,
  endpoint,
  scope = 'market:all',
}: GetTokenObj) {
  let token = '' as any
  const getCookieToken = Cookies.get('clAccessToken')
  if (!getCookieToken && clientId && endpoint) {
    const auth = await getSalesChannelToken({
      clientId,
      endpoint,
      scope,
    })
    token = auth?.accessToken
    Cookies.set('clAccessToken', auth?.accessToken as string, {
      // @ts-ignore
      expires: auth?.expires,
    })
  } else {
    token = getCookieToken || ''
  }
  return token
}
