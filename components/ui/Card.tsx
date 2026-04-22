import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  variant?: 'default' | 'red'
}

export function Card({ children, className = '', variant = 'default' }: Props) {
  const c = variant === 'red' ? 'pb-card-red' : 'pb-card'
  return <div className={`${c} ${className}`}>{children}</div>
}
