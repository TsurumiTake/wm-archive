import { LanguageText } from "../ui/LanguageText";

interface SectionHeaderProps {
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  index = "00",
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeaderProps) {
  return (
    <header className={`section-header section-header--${align}`}>
      <div className="section-header__index" aria-hidden="true">
        {index}
      </div>
      <div className="section-header__copy">
        <p className="eyebrow"><LanguageText text={eyebrow} /></p>
        <h2><LanguageText text={title} /></h2>
        {description && <p className="section-header__description"><LanguageText text={description} /></p>}
      </div>
    </header>
  );
}
