const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Boston, MA',
    text: 'SpotlyClean transformed my apartment. The team was professional, thorough, and my place has never looked better. Booking was effortless.',
    rating: 5,
  },
  {
    name: 'James K.',
    location: 'Cambridge, MA',
    text: 'We switched our office cleaning to SpotlyClean and the difference is night and day. Reliable, consistent, and great communication.',
    rating: 5,
  },
  {
    name: 'Maria L.',
    location: 'Somerville, MA',
    text: 'As an Airbnb host, turnaround cleaning is critical. SpotlyClean nails it every time — my guests always comment on how spotless the place is.',
    rating: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            What our clients say
          </h2>
          <p className="mt-2 text-slate-600">
            Real reviews from real clients across Massachusetts
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <Stars count={t.rating} />
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-400">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
