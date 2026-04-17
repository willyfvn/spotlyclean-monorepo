import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-md',
            headerTitle: 'font-display',
            formButtonPrimary: 'bg-forest hover:bg-forest-deep',
          },
        }}
      />
    </div>
  )
}
