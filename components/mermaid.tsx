'use client';

import { useEffect, useRef, useState } from 'react';

let idCounter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const idRef = useRef(`mermaid-${idCounter++}`);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const isDark =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: isDark ? 'dark' : 'default',
        fontFamily: 'inherit',
      });

      try {
        const { svg } = await mermaid.render(idRef.current, chart);
        if (!cancelled) {
          setSvg(svg);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
        }
      }
    }

    render();

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', render);

    return () => {
      cancelled = true;
      media.removeEventListener('change', render);
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="text-sm text-red-500 whitespace-pre-wrap">
        {`Mermaid error: ${error}\n\n${chart}`}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
