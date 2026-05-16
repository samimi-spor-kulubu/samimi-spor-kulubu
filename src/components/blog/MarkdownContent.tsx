import ReactMarkdown from 'react-markdown';

export function MarkdownContent({content}: {content: string}) {
  return (
    <div className="text-base leading-relaxed text-brand-black">
      <ReactMarkdown
        components={{
          h2: ({children}) => (
            <h2 className="mt-10 font-heading text-2xl tracking-wider text-brand-black sm:text-3xl">
              {children}
            </h2>
          ),
          h3: ({children}) => (
            <h3 className="mt-8 font-heading text-xl tracking-wider text-brand-black">
              {children}
            </h3>
          ),
          p: ({children}) => (
            <p className="mt-4 text-base leading-relaxed text-brand-gray">
              {children}
            </p>
          ),
          ul: ({children}) => (
            <ul className="mt-4 list-disc space-y-2 pl-6 text-brand-gray marker:text-brand-amber">
              {children}
            </ul>
          ),
          ol: ({children}) => (
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-brand-gray marker:text-brand-amber">
              {children}
            </ol>
          ),
          li: ({children}) => <li className="leading-relaxed">{children}</li>,
          strong: ({children}) => (
            <strong className="font-semibold text-brand-black">
              {children}
            </strong>
          ),
          em: ({children}) => <em className="italic">{children}</em>,
          a: ({href, children}) => (
            <a
              href={href}
              className="text-brand-amber underline underline-offset-2 hover:text-brand-black"
            >
              {children}
            </a>
          ),
          blockquote: ({children}) => (
            <blockquote className="mt-6 border-l-4 border-brand-yellow bg-brand-surface px-5 py-3 italic text-brand-gray">
              {children}
            </blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
