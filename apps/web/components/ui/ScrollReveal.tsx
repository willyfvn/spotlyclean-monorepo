'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type Animation =
  | 'slide-up'
  | 'fade-in'
  | 'scale-in'
  | 'slide-left'
  | 'slide-right'
  | 'blur-in'

interface ScrollRevealProps {
  children: ReactNode
  animation?: Animation
  delay?: number
  duration?: number
  className?: string
  threshold?: number
  once?: boolean
}

const animationStyles: Record<Animation, { from: string; to: string }> = {
  'slide-up': {
    from: 'translate-y-5 opacity-0',
    to: 'translate-y-0 opacity-100',
  },
  'fade-in': {
    from: 'opacity-0',
    to: 'opacity-100',
  },
  'scale-in': {
    from: 'scale-[0.97] opacity-0',
    to: 'scale-100 opacity-100',
  },
  'slide-left': {
    from: 'translate-x-5 opacity-0',
    to: 'translate-x-0 opacity-100',
  },
  'slide-right': {
    from: '-translate-x-5 opacity-0',
    to: 'translate-x-0 opacity-100',
  },
  'blur-in': {
    from: 'opacity-0 blur-[2px]',
    to: 'opacity-100 blur-0',
  },
}

export function ScrollReveal({
  children,
  animation = 'slide-up',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (prefersReduced) {
      setIsVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, prefersReduced])

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  const { from, to } = animationStyles[animation]

  return (
    <div
      ref={ref}
      className={`will-change-[transform,opacity] transition-all ${isVisible ? to : from} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  )
}
