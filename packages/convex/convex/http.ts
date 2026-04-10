import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { api } from './_generated/api'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = await request.json()

    const eventType = body.type
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = body.data
      const email = email_addresses?.[0]?.email_address
      const name = [first_name, last_name].filter(Boolean).join(' ') || 'User'

      if (email) {
        await ctx.runMutation(api.users.createProfile, {
          clerkId: id,
          email,
          name,
        })
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
})

export default http
