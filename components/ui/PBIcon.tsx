"use client";

import { Icon } from "@iconify/react";

type Props = {
  icon: string;
  size?: number;
  color?: string;
  className?: string;
  "aria-hidden"?: boolean;
};

export function PBIcon({ icon, size = 24, color = "currentColor", className, ...rest }: Props) {
  return (
    <Icon
      icon={icon}
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className ?? ""}`}
      style={{ color }}
      {...rest}
    />
  );
}
