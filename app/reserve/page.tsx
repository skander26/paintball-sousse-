import { Suspense } from 'react'
import ReserveClient from '@/components/reserve/ReserveClient'

export default function ReservePage() {
  return (
    <Suspense fallback={null}>
      <ReserveClient />
    </Suspense>
  )
}
