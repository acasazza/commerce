import type { ReactNode } from 'react'
import {
  CommerceConfig,
  CommerceProvider as CoreCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@commerce'
import { commercelayerProvider, CommercelayerProvider } from './provider'

export { commercelayerProvider }
export type { CommercelayerProvider }

export const commercelayerConfig: CommerceConfig = {
  locale: 'en-us',
  cartCookie: 'cl_cartId',
}

export type CommercelayerConfig = Partial<CommerceConfig>

export type CommercelayerProps = {
  children?: ReactNode
  locale: string
} & CommercelayerConfig

export function CommerceProvider({ children, ...config }: CommercelayerProps) {
  return (
    <CoreCommerceProvider
      provider={commercelayerProvider}
      config={{ ...commercelayerConfig, ...config }}
    >
      {children}
    </CoreCommerceProvider>
  )
}

export const useCommerce = () => useCoreCommerce<CommercelayerProvider>()
