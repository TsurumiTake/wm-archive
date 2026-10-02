import { MessageWall } from "../components/MessageWall/MessageWall";
import { LanguageText } from "../components/ui/LanguageText";
import { usePageMeta } from "../hooks/usePageMeta";

export function Letter() {
  usePageMeta("LETTER｜花与爱丽丝", "看完照片之后，在这里留下一句话。");

  return (
    <div className="page page--letter">
      <header className="page-hero page-hero--letter">
        <div className="shell page-hero__inner">
          <p className="eyebrow"><LanguageText text="LETTER" /></p>
          <h1><LanguageText text="LETTER" /></h1>

        </div>
      </header>
      <MessageWall />
    </div>
  );
}
