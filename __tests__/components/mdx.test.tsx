import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  slugify,
  createHeading,
  Table,
  CustomLink,
  Callout,
  ProsCard,
  ConsCard,
  Code,
} from '@/components/mdx';
import { serialize } from 'next-mdx-remote/serialize';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} alt={props.alt as string} />,
}));

describe('slugify', () => {
  it('converts to kebab-case', () => {
    expect(slugify('What is a Merkle Tree?')).toBe('what-is-a-merkle-tree');
  });

  it('replaces & with -and-', () => {
    expect(slugify('Foo & Bar')).toBe('foo-and-bar');
  });

  it('strips non-word characters except hyphen', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a   b')).toBe('a-b');
  });

  it('trims whitespace', () => {
    expect(slugify('  title  ')).toBe('title');
  });
});

describe('createHeading', () => {
  it('renders heading with correct level and id', () => {
    const H2 = createHeading(2);
    const { container } = render(<H2>What is a Merkle Tree?</H2>);
    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2).toHaveAttribute('id', 'what-is-a-merkle-tree');
  });

  it('includes anchor link with hash href', () => {
    const H3 = createHeading(3);
    const { container } = render(<H3>Building the Tree</H3>);
    const anchor = container.querySelector('a.anchor');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', '#building-the-tree');
  });
});

describe('Table', () => {
  it('renders headers and rows', () => {
    const data = {
      headers: ['A', 'B'],
      rows: [
        ['1', '2'],
        ['3', '4'],
      ],
    };
    render(<Table data={data} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders table element', () => {
    const data = { headers: ['H'], rows: [['c']] };
    const { container } = render(<Table data={data} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });
});

describe('CustomLink', () => {
  it('renders Next Link for internal href', () => {
    render(<CustomLink href="/blog/foo">Link</CustomLink>);
    const a = screen.getByRole('link', { name: 'Link' });
    expect(a).toHaveAttribute('href', '/blog/foo');
  });

  it('renders anchor for hash href', () => {
    render(<CustomLink href="#section">Anchor</CustomLink>);
    const a = screen.getByRole('link', { name: 'Anchor' });
    expect(a).toHaveAttribute('href', '#section');
  });

  it('renders external link with target _blank and noopener noreferrer', () => {
    render(<CustomLink href="https://example.com">External</CustomLink>);
    const a = screen.getByRole('link', { name: 'External' });
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('Callout', () => {
  it('renders emoji and children', () => {
    render(
      <Callout emoji="💡">
        <p>Note content</p>
      </Callout>
    );
    expect(screen.getByText('💡')).toBeInTheDocument();
    expect(screen.getByText('Note content')).toBeInTheDocument();
  });
});

describe('ProsCard', () => {
  it('renders title and pros list', () => {
    render(
      <ProsCard title="Vitest" pros={['Fast', 'ESM native']} />
    );
    expect(screen.getByText(/You might use Vitest if/)).toBeInTheDocument();
    expect(screen.getByText('Fast')).toBeInTheDocument();
    expect(screen.getByText('ESM native')).toBeInTheDocument();
  });
});

describe('ConsCard', () => {
  it('renders title and cons list', () => {
    render(
      <ConsCard title="Jest" cons={['Slow', 'CJS']} />
    );
    expect(screen.getByText(/You might not use Jest if/)).toBeInTheDocument();
    expect(screen.getByText('Slow')).toBeInTheDocument();
    expect(screen.getByText('CJS')).toBeInTheDocument();
  });
});

describe('Code', () => {
  it('renders inline code without language as plain code', () => {
    const { container } = render(
      <Code className="">const x = 1</Code>
    );
    expect(container.querySelector('code')).toHaveTextContent('const x = 1');
  });

  it('renders code with unknown language as plain code', () => {
    const { container } = render(
      <Code className="language-unknown">code</Code>
    );
    expect(container.querySelector('code')).toHaveTextContent('code');
  });

  it('renders highlighted code for known language', () => {
    const { container } = render(
      <Code className="language-python">{'def foo(): pass'}</Code>
    );
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.querySelector('code')).toHaveAttribute('class', 'language-python');
  });
});

describe('MDX compilation with blockJS:false', () => {
  it('preserves data prop on Table when blockJS is false', async () => {
    const mdxSource = `
<Table
  data={{
    headers: ['A', 'B'],
    rows: [['1', '2']],
  }}
/>
`;
    const result = await serialize(mdxSource, { blockJS: false });
    expect(result.compiledSource).toContain('data');
    expect(result.compiledSource).toContain('headers');
    expect(result.compiledSource).toContain('rows');
  });

  it('strips data prop when blockJS is true (default)', async () => {
    const mdxSource = '<Table data={{ headers: ["A"], rows: [["1"]] }} />';
    const result = await serialize(mdxSource, { blockJS: true });
    expect(result.compiledSource).not.toContain('headers');
    expect(result.compiledSource).toMatch(/_\s*jsxDEV\s*\(\s*Table\s*,\s*\{\s*\}\s*/);
  });
});
