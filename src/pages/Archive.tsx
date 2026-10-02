import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AssetImage } from "../components/AssetImage/AssetImage";
import { DuoPhotoSlider } from "../components/DuoPhotoSlider/DuoPhotoSlider";
import { MemberPhotoSlider } from "../components/MemberPhotoSlider/MemberPhotoSlider";
import { SectionHeader } from "../components/SectionHeader/SectionHeader";
import { LanguageText } from "../components/ui/LanguageText";
import { members } from "../data/members";
import { moments } from "../data/moments";
import { usePageMeta } from "../hooks/usePageMeta";
import { ARCHIVE_IMAGES } from "../lib/media";

type ArchiveTab = "woni" | "minami" | "duo";

const tabs: Array<{ id: ArchiveTab; label: string }> = [
  { id: "woni", label: "WONI 档案" },
  { id: "minami", label: "MINAMI 档案" },
  { id: "duo", label: "她们之间" }
];

export function Archive() {
  const [searchParams] = useSearchParams();
  const initialMember = searchParams.get("member");
  const [activeTab, setActiveTab] = useState<ArchiveTab>(
    initialMember === "minami" ? "minami" : initialMember === "woni" ? "woni" : "woni"
  );

  usePageMeta("她们｜花与爱丽丝", "认识 WONI 和 MINAMI，并翻阅她们的视觉记录。");

  useEffect(() => {
    if (initialMember === "minami" || initialMember === "woni") setActiveTab(initialMember);
  }, [initialMember]);

  const member = members.find((item) => item.id === activeTab);

  return (
    <div className="page page--archive">
      <header className="page-hero page-hero--archive">
        <div className="shell page-hero__inner">
          <p className="eyebrow"><LanguageText text="PORTRAITS · 她们" /></p>
          <h1>认识她们</h1>
          <p className="page-hero__pair english">WONI × MINAMI</p>
          <p className="page-hero__lead">
            <LanguageText text="从两张个人照片开始认识她们，然后再回到那些被镜头留下的瞬间。" />
          </p>
        </div>
      </header>

      <section className="section section--paper archive-section">
        <div className="shell">
          <div className="archive-tabs" role="tablist" aria-label="人物分类">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} className={activeTab === tab.id ? "is-active" : ""} onClick={() => setActiveTab(tab.id)}>
                <LanguageText text={tab.label} />
              </button>
            ))}
          </div>

          {member && (
            <div className="archive-profile" role="tabpanel">
              <div className="archive-profile__visual">
                <MemberPhotoSlider memberName={member.displayName} photos={member.gallery} />
                <span className="archive-profile__code"><LanguageText text={`PHOTO / ${member.displayName}`} /></span>
              </div>
              <div className="archive-profile__content">
                <p className="eyebrow"><LanguageText text={`PROFILE · ${member.group}`} /></p>
                <h2 className="english">{member.displayName}</h2>
                <p className="archive-profile__local"><LanguageText text={member.localName} /></p>
                <p className="archive-profile__intro"><LanguageText text={member.introduction} /></p>
                <ul className="keyword-list keyword-list--large">
                  {member.keywords.map((keyword) => <li key={keyword}><LanguageText text={keyword} /></li>)}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "duo" && (
            <div className="archive-duo" role="tabpanel">
              <div className="archive-duo__hero">
                <AssetImage image={ARCHIVE_IMAGES.duo} aspectRatio="16 / 10" hover />
              </div>
              <div className="archive-duo__content">
                <p className="eyebrow english">WONI × MINAMI</p>
                <h2 className="english">WONI × MINAMI</h2>
                <p><LanguageText text="这里收录双人照片和公开影像中的日常片段。" /></p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section section--soft archive-records" id="records">
        <div className="shell">
          <SectionHeader
            index="01"
            eyebrow="PHOTOS · 照片"
            title="所有照片"
          />

          <DuoPhotoSlider items={moments} />
        </div>
      </section>
    </div>
  );
}
