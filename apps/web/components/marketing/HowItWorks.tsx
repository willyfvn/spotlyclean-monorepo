const steps = [
  {
    number: '1',
    title: 'Get your estimate',
    description:
      'Tell us about your space and get an instant price — no phone calls, no waiting.',
  },
  {
    number: '2',
    title: 'Book online',
    description:
      'Pick your date and time, add any extras, and pay securely online.',
  },
  {
    number: '3',
    title: 'Sit back & relax',
    description:
      'Our insured, vetted cleaners handle the rest. Track progress in real time.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
          <p className="mt-2 text-slate-600">
            From quote to clean in three simple steps
          </p>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
