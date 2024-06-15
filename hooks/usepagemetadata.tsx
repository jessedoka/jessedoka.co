import { useEffect } from 'react';

interface PageMetadataProps {
  title: string;
  description: string;
}

function usePageMetadata({ title, description }: PageMetadataProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const metaTag = document.createElement('meta');
        metaTag.name = 'description';
        metaTag.content = description;
        document.head.appendChild(metaTag);
      }
    }
  }, [title, description]);
}

export { usePageMetadata };