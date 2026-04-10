import { httpRouter } from 'convex/server'

const http = httpRouter()

// Webhook routes will be added here:
// http.route({ path: '/stripe', method: 'POST', handler: handleStripeWebhook })
// http.route({ path: '/clerk', method: 'POST', handler: handleClerkWebhook })

export default http
