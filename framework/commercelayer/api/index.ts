import {
  CommerceAPI,
  CommerceAPIConfig,
  getCommerceApi as commerceApi,
} from '@commerce/api'
import createFetchStoreApi from './utils/fetch-api'
import type { RequestInit } from '@vercel/fetch'

import type { CartAPI } from './endpoints/cart'
import type { CustomerAPI } from './endpoints/customer'
import type { LoginAPI } from './endpoints/login'
import type { LogoutAPI } from './endpoints/logout'
import type { SignupAPI } from './endpoints/signup'
import type { ProductsAPI } from './endpoints/catalog/products'
import type { WishlistAPI } from './endpoints/wishlist'

import login from './operations/login'
import getAllPages from './operations/get-all-pages'
import getPage from './operations/get-page'
import getSiteInfo from './operations/get-site-info'
import getCustomerWishlist from './operations/get-customer-wishlist'
import getAllProductPaths from './operations/get-all-product-paths'
import getAllProducts from './operations/get-all-products'
import getProduct from './operations/get-product'

import { getToken } from './utils/getToken'

export interface CommercelayerConfig extends CommerceAPIConfig {
  storeApiUrl: string
  storeApiToken: string
  storeApiClientId: string
  storeApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T>
}

const CLIENT_ID = process.env.COMMERCELAYER_CLIENT_ID
const ENDPOINT = process.env.COMMERCELAYER_ENDPOINT
const MARKET_SCOPE = process.env.COMMERCELAYER_MARKET_SCOPE

if (!CLIENT_ID) {
  throw new Error(
    `The environment variable COMMERCELAYER_CLIENT_ID is missing and it's required to access your store`
  )
}

if (!ENDPOINT) {
  throw new Error(
    `The environment variable COMMERCELAYER_ENDPOINT is missing and it's required to access your store`
  )
}

if (!MARKET_SCOPE) {
  throw new Error(
    `The environment variable COMMERCELAYER_MARKET_SCOPE is missing and it's required to access your store`
  )
}

export async function getAccessToken() {
  const token = await getToken({
    clientId: CLIENT_ID,
    endpoint: ENDPOINT,
    scope: MARKET_SCOPE,
  })
  return token
}

const ONE_DAY = 60 * 60 * 24

const config: CommercelayerConfig = {
  commerceUrl: '',
  apiToken: '',
  customerCookie: '',
  storeApiUrl: ENDPOINT,
  storeApiToken: '',
  storeApiClientId: CLIENT_ID,
  cartCookie: '',
  cartCookieMaxAge: ONE_DAY * 30,
  storeApiFetch: createFetchStoreApi(() => getCommerceApi().getConfig()),
}

const operations = {
  login,
  getAllPages,
  getPage,
  getSiteInfo,
  getCustomerWishlist,
  getAllProductPaths,
  getAllProducts,
  getProduct,
}

export const provider = { config, operations }

export type Provider = typeof provider

export type APIs =
  | CartAPI
  | CustomerAPI
  | LoginAPI
  | LogoutAPI
  | SignupAPI
  | ProductsAPI
  | WishlistAPI

export type CommercelayerAPI<P extends Provider = Provider> = CommerceAPI<P>

export function getCommerceApi<P extends Provider>(
  customProvider: P = provider as any
): CommercelayerAPI<P> {
  return commerceApi(customProvider)
}
