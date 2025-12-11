import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Component that formats text with:
 * - Preserved line breaks
 * - Clickable URLs that open in new tabs
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  // URL regex pattern that matches http://, https://, and www. URLs
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

  const formatLine = (line: string, lineIndex: number) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // Reset regex state
    urlRegex.lastIndex = 0;

    while ((match = urlRegex.exec(line)) !== null) {
      const url = match[0];
      const matchIndex = match.index;

      // Add text before the URL
      if (matchIndex > lastIndex) {
        parts.push(line.substring(lastIndex, matchIndex));
      }

      // Add the clickable URL
      const href = url.startsWith('www.') ? `https://${url}` : url;
      parts.push(
        <a
          key={`${lineIndex}-${matchIndex}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {url}
        </a>
      );

      lastIndex = matchIndex + url.length;
    }

    // Add remaining text after the last URL
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return parts.length > 0 ? parts : line;
  };

  const lines = text.split('\n');

  return (
    <div className={className}>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {formatLine(line, index)}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
};
