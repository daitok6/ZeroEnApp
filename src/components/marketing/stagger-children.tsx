'use client';
export function StaggerChildren({ children, className, staggerDelay: _ }: { children: React.ReactNode; className?: string; staggerDelay?: number }) {
  return <div className={className}>{children}</div>;
}
export function StaggerItem({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
