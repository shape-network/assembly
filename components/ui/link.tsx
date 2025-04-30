import { cn } from '@/lib/utils';
import { ComponentProps, FC, PropsWithChildren } from 'react';

export const InlineLink: FC<PropsWithChildren<ComponentProps<'a'>>> = ({
  children,
  href,
  className,
}) => {
  return (
    <a
      className={cn(
        'inline-flex items-center gap-x-2 font-medium underline hover:no-underline',
        className
      )}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};
