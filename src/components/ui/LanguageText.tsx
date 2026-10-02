import { Fragment } from "react";

const TOKEN_PATTERN = /([A-Za-z0-9]+|[\u3040-\u30ff]+|[\uac00-\ud7af]+)/g;

function tokenClass(token: string) {
  if (/^[A-Za-z0-9]+$/.test(token)) return "latin";
  if (/^[\u3040-\u30ff]+$/.test(token)) return "japanese";
  if (/^[\uac00-\ud7af]+$/.test(token)) return "korean";
  if (/[\u4e00-\u9fff]/.test(token)) return "chinese";
  return "";
}

export function LanguageText({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(TOKEN_PATTERN).filter(Boolean);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const styleClass = tokenClass(part);
        return styleClass ? (
          <span className={styleClass} key={`${part}-${index}`}>{part}</span>
        ) : (
          <Fragment key={`${part}-${index}`}>{part}</Fragment>
        );
      })}
    </span>
  );
}
