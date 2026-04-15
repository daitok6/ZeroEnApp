import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold font-heading text-[#F4F4F2] mt-8 mb-4 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2] mt-8 mb-3 border-b border-[#374151] pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold font-heading text-[#F4F4F2] mt-6 mb-2">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-[#9CA3AF] font-mono text-sm md:text-base leading-relaxed mb-4">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-[#00E87A] hover:underline font-mono"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="text-[#9CA3AF] font-mono text-sm md:text-base mb-4 space-y-1 list-none">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="flex items-start gap-2">
        <span className="text-[#00E87A] shrink-0 mt-1">→</span>
        <span>{children}</span>
      </li>
    ),
    strong: ({ children }) => (
      <strong className="text-[#F4F4F2] font-bold">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="text-[#9CA3AF] italic">{children}</em>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#00E87A] pl-4 my-4 text-[#6B7280] font-mono text-sm italic">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-[#111827] text-[#00E87A] font-mono text-xs px-1.5 py-0.5 rounded border border-[#374151]">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <div className="my-6 rounded-lg overflow-hidden border border-[#374151]">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#111827] border-b border-[#374151]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
        </div>
        <pre className="overflow-x-auto p-4 bg-[#0D0D0D] text-[#F4F4F2] font-mono text-xs md:text-sm leading-relaxed">
          {children}
        </pre>
      </div>
    ),
    hr: () => <hr className="border-[#374151] my-8" />,
  };
}
