'use client'

import { Icon } from '@iconify-icon/react'
import { ICONS, type IconKey } from '@/icons'

type Props = {
  name: IconKey
  className?: string
  style?: React.CSSProperties
}

export function PBIcon({ name, className, style }: Props) {
  return <Icon icon={ICONS[name]} className={className} style={style} width="1em" height="1em" />
}
