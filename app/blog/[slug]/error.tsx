'use client';

import { useEffect } from 'react';

export default function BlogError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <p>Failed to load this post.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
