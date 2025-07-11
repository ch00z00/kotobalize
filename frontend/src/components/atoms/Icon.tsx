import React from 'react';
import { icons, LucideProps } from 'lucide-react';

export type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
  name: IconName;
}

const Icon = ({ name, color, size, className, ...props }: IconProps) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.warn(`Icon with name "${name}" not found.`);
    return null;
  }

  return (
    <LucideIcon color={color} size={size} className={className} {...props} />
  );
};

export default Icon;
