import { Slot } from 'expo-router'
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import * as SecureStore from 'expo-secure-store'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!)

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key)
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value)
  },
}

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth()
  if (!isLoaded) return null

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexClerkProvider>
        <Slot />
      </ConvexClerkProvider>
    </ClerkProvider>
  )
}
