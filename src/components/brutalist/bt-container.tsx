import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function BTContainer({ children, className = '' }: Props) {
  return (
    <div
      style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', padding: '0 16px' }}
      className={className}
    >
      {children}
    </div>
  );
}
