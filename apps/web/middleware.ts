import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing(.*)',
  '/about(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/book(.*)',
  '/api/stripe/webhook',
  '/api/stripe/checkout',
  '/api/resend',
  '/api/chat',
])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
