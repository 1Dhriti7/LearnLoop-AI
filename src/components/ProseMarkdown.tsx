import React from "react";

interface ProseMarkdownProps {
  content: string;
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#0D132B]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="rounded bg-[#F1F0FB] px-1.5 py-0.5 font-mono text-[0.85em] text-[#161F42]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const ProseMarkdown: React.FC<ProseMarkdownProps> = ({ content }) => {
  const blocks = content.split(/```([\s\S]*?)```/g);

  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-[#1F2937]">
      {blocks.map((block, bIdx) => {
        if (bIdx % 2 === 1) {
          const lines = block.split("\n");
          const firstLine = lines[0]?.trim() ?? "";
          const hasLang = /^[a-zA-Z0-9_-]{1,16}$/.test(firstLine);
          const codeBody = hasLang ? lines.slice(1).join("\n") : block;
          return (
            <pre
              key={bIdx}
              className="overflow-x-auto rounded-lg border border-[#E4E3F5] bg-[#0D132B] p-3.5 font-mono text-xs leading-6 text-[#F8F9FC]"
            >
              <code>{codeBody.trim()}</code>
            </pre>
          );
        }

        const lines = block.split("\n");
        const elements: React.ReactNode[] = [];
        let listItems: { ordered: boolean; text: string }[] = [];

        const flushList = (keyPrefix: string) => {
          if (listItems.length === 0) return;
          const isOrdered = listItems[0].ordered;
          if (isOrdered) {
            elements.push(
              <ol
                key={`${keyPrefix}-ol`}
                className="list-decimal space-y-1.5 pl-5 text-[#1F2937]"
              >
                {listItems.map((item, i) => (
                  <li key={i}>{renderInline(item.text)}</li>
                ))}
              </ol>
            );
          } else {
            elements.push(
              <ul
                key={`${keyPrefix}-ul`}
                className="list-disc space-y-1.5 pl-5 text-[#1F2937]"
              >
                {listItems.map((item, i) => (
                  <li key={i}>{renderInline(item.text)}</li>
                ))}
              </ul>
            );
          }
          listItems = [];
        };

        lines.forEach((rawLine, lIdx) => {
          const line = rawLine.trim();
          if (!line) {
            flushList(`${bIdx}-${lIdx}`);
            return;
          }

          const h3Match = line.match(/^###\s+(.+)/);
          const h2Match = line.match(/^##\s+(.+)/);
          const h1Match = line.match(/^#\s+(.+)/);

          if (h1Match || h2Match || h3Match) {
            flushList(`${bIdx}-${lIdx}`);
            const headingText = (h3Match?.[1] || h2Match?.[1] || h1Match?.[1] || "").trim();
            elements.push(
              <h4
                key={`${bIdx}-${lIdx}-h`}
                className="pt-1 font-display text-sm font-semibold text-[#161F42]"
              >
                {renderInline(headingText)}
              </h4>
            );
            return;
          }

          const ulMatch = line.match(/^[-*]\s+(.+)/);
          const olMatch = line.match(/^\d+\.\s+(.+)/);

          if (ulMatch) {
            if (listItems.length > 0 && listItems[0].ordered) {
              flushList(`${bIdx}-${lIdx}`);
            }
            listItems.push({ ordered: false, text: ulMatch[1] });
            return;
          }

          if (olMatch) {
            if (listItems.length > 0 && !listItems[0].ordered) {
              flushList(`${bIdx}-${lIdx}`);
            }
            listItems.push({ ordered: true, text: olMatch[1] });
            return;
          }

          flushList(`${bIdx}-${lIdx}`);
          elements.push(
            <p key={`${bIdx}-${lIdx}-p`}>{renderInline(line)}</p>
          );
        });

        flushList(`${bIdx}-end`);

        return <React.Fragment key={bIdx}>{elements}</React.Fragment>;
      })}
    </div>
  );
};
