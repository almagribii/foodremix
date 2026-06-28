import Link from 'next/link';

interface RenderMessageProps {
  content: string;
  isUser: boolean;
}

// Custom markdown renderer for chat messages
export default function RenderMessage({ content, isUser }: RenderMessageProps) {
  // Split by lines first to handle bullet points
  const lines = content.split('\n');

  return (
    <div className="text-sm leading-relaxed">
      {lines.map((line, lineIndex) => {
        // Check if it's a bullet point line
        const bulletMatch = line.match(/^[•\-\*]\s+(.+)$/);
        const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);

        let processedLine = line;
        let isBullet = false;
        let isNumbered = false;
        let bulletNumber = '';

        if (bulletMatch) {
          processedLine = bulletMatch[1];
          isBullet = true;
        } else if (numberedMatch) {
          bulletNumber = numberedMatch[1];
          processedLine = numberedMatch[2];
          isNumbered = true;
        }

        // Parse inline markdown (links, bold, emoji headers)
        const parts = processedLine.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);

        const renderedContent = parts.map((part, index) => {
          // Link pattern: [text](url)
          const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (linkMatch) {
            const [, text, url] = linkMatch;
            return (
<Link
                key={index}
                href={url}
                className={`underline transition-colors ${
                  isUser ? 'text-black/80 hover:opacity-80' : 'text-[var(--accent)] hover:opacity-80'
                }`}
              >
                {text}
              </Link>
            );
          }

          // Bold pattern: **text**
          const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
          if (boldMatch) {
            return (
              <span key={index} className="font-semibold">
                {boldMatch[1]}
              </span>
            );
          }

          return part;
        });

        // Return the line with appropriate styling
        if (isBullet) {
          return (
            <div key={lineIndex} className="flex gap-2 ml-1">
              <span>•</span>
              <span>{renderedContent}</span>
            </div>
          );
        }

        if (isNumbered) {
          return (
            <div key={lineIndex} className="flex gap-2 ml-1">
              <span>{bulletNumber}.</span>
              <span>{renderedContent}</span>
            </div>
          );
        }

        // Empty line = paragraph break
        if (line.trim() === '') {
          return <div key={lineIndex} className="h-2" />;
        }

        return <div key={lineIndex}>{renderedContent}</div>;
      })}
    </div>
  );
}
