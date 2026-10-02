import { Link } from "react-router-dom";
import type { Member } from "../../types/content";
import { AssetImage } from "../AssetImage/AssetImage";
import { HoverImage } from "../HoverImage/HoverImage";
import { LanguageText } from "../ui/LanguageText";

interface MemberCardProps {
  member: Member;
  reverse?: boolean;
}

export function MemberCard({ member, reverse = false }: MemberCardProps) {
  return (
    <article className={`member-card member-card--${member.accent} ${reverse ? "member-card--reverse" : ""}`}>
      <Link className="member-card__link" to={`/archive?member=${member.id}`} aria-label={`查看 ${member.displayName} 的人物档案`}>
        <div className="member-card__portrait">
          <HoverImage>
            <AssetImage image={member.portrait} aspectRatio="3 / 4" />
          </HoverImage>
          {member.gallery[1] && (
            <div className="member-card__secondary-photo">
              <AssetImage image={member.gallery[1]} aspectRatio="4 / 5" />
            </div>
          )}
          <span className="member-card__stamp">照片</span>
        </div>
        <div className="member-card__body">
          <div className="member-card__headline">
            <h3><LanguageText text={member.displayName} /></h3>
            <LanguageText text={member.localName} />
          </div>
          <p className="member-card__role"><LanguageText text={`${member.group} · ${member.role}`} /></p>
          <p className="member-card__intro"><LanguageText text={member.introduction} /></p>
          <ul className="keyword-list" aria-label={`${member.displayName} 关键词`}>
            {member.keywords.map((keyword) => (
              <li key={keyword}><LanguageText text={keyword} /></li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}
